import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";
import { sequelize } from "../config/database.js";
import { AppError } from "../helpers/errorHandler.js";
import { customerBalanceCalculationAfterInvoiceUpdate } from "../helpers/helperFunctions.js";
import { Product } from "../models/Product.js";

// TODO Remove NewProducts from the invoice update route and put it in a different route, to ensure that everything goes smoothly
export default Object.freeze({
    handleInvoiceCreation: async (req, res) => {
        try {
            await sequelize.transaction(async (t) => {
                const { customer_id, products, invoice_date } = req.body;
                const line_prices = products.map(
                    (product) => product.price * product.quantity,
                );

                const grand_total = line_prices.reduce(
                    (sum, amount) => sum + amount,
                    0,
                );
                const count = await Invoice.count();
                const newCount = count + 1;
                const invoice_id = `${new Date().getFullYear()}-${String(
                    newCount,
                ).padStart(3, "0")}`;
                const invoice = await Invoice.create({
                    invoice_id,
                    customer_id,
                    invoice_total: grand_total,
                    invoice_date,
                });
                const readyInvoiceLines = products.map((p, index) => ({
                    linePrice: line_prices[index],
                    quantity: p.quantity,
                    product_id: p.product_id,
                    invoice_id: invoice.invoice_id,
                }));
                const invoiceLines = await InvoiceLine.bulkCreate(
                    readyInvoiceLines,
                );
                res.status(201).json({
                    message: "Invoice Created Successfully",
                    invoice,
                    invoiceLines,
                });
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleInvoiceUpdate: async (req, res) => {
        try {
            await sequelize.transaction(async (t) => {
                const { newProducts, invoice_date } = req.body;
                const { invoice_id } = req.params;
                let line_prices = [];
                if (newProducts)
                    line_prices.push(
                        ...newProducts?.map(
                            (product) => product.price * product.quantity,
                        ),
                    );
                const oldInvoice = await Invoice.findByPk(invoice_id);
                const grand_total = line_prices.length
                    ? line_prices?.reduce((sum, amount) => sum + amount, 0)
                    : oldInvoice.invoice_total;

                await Promise.all([
                    customerBalanceCalculationAfterInvoiceUpdate(
                        oldInvoice,
                        grand_total,
                    ),
                    Invoice.update(
                        {
                            invoice_id,
                            invoice_date,
                        },
                        {
                            where: { invoice_id },
                        },
                    ),
                ]);
                if (newProducts?.length || newProducts) {
                    const readyInvoiceLines = newProducts?.map((p, index) => ({
                        linePrice: line_prices[index],
                        quantity: p.quantity,
                        product_id: p.product_id,
                        invoice_id,
                    }));
                    await InvoiceLine.bulkCreate(readyInvoiceLines);
                }

                return res.status(201).json({
                    message: "Invoice Update Successfully",
                    invoice: await Invoice.findByPk(invoice_id),
                    invoiceLines: await InvoiceLine.findAll({
                        where: { invoice_id },
                    }),
                });
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleInvoiceDeletion: async (req, res) => {
        try {
            const { invoice_id } = req.params;
            await Promise.all([
                InvoiceLine.destroy({ where: { invoice_id } }),
                Invoice.destroy({ where: { invoice_id } }),
            ]);
            return res.status(200).json({
                message: "Invoice deleted Successfully",
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleGettingInvoice: async (req, res) => {
        try {
            const { invoice_id } = req.params;
            const [invoice, invoiceLines] = await Promise.all([
                Invoice.findByPk(invoice_id),
                InvoiceLine.findAll({
                    where: { invoice_id: invoice_id },
                }),
            ]);
            return res.status(200).json({
                invoice,
                invoiceLines,
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleGettingInvoicesByPaginationAndCustomerId: async (req, res) => {
        try {
            const { customer_id } = req.params;
            const invoices = await Invoice.findAndCountAll({
                offset: 0,
                limit: 10,
                where: { customer_id: Number(customer_id) },
            });
            const invoiceLines = await Promise.all(
                invoices.rows.map((invoice) =>
                    InvoiceLine.findAndCountAll({
                        offset: 0,
                        limit: 10,
                        where: { invoice_id: invoice.invoice_id },
                    }),
                ),
            );
            return res.status(200).json({
                invoices,
                invoiceLines,
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleInvoiceLineUpdate: async (req, res) => {
        try {
            const { line_id, invoice_id } = req.params;
            const { product_id, quantity, price } = req.body;
            await sequelize.transaction(async () => {
                const oldLine = await InvoiceLine.findByPk(line_id);
                const product = await Product.findByPk(product_id);
                if (product_id !== oldLine.product_id) {
                    product.quantityOnHand += oldLine.quantity;
                }
                let remainder = 0;
                if (oldLine.quantity >= quantity) {
                    remainder = oldLine.quantity - quantity;
                    product.quantityOnHand += remainder;
                } else {
                    remainder = quantity - oldLine.quantity;
                    product.quantityOnHand -= remainder;
                }
                await InvoiceLine.update(
                    {
                        linePrice: quantity * price,
                        product_id,
                        quantity,
                    },
                    {
                        where: {
                            invoice_line_id: line_id,
                        },
                    },
                );

                return res.status(201).json({
                    message: "Invoice Line updated successfully",
                    invoiceLine: await InvoiceLine.findByPk(line_id),
                });
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    status: "Error",
                    message: `${error.message}`,
                });
            }
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
});
