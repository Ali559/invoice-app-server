import { sequelize } from "../config/database.js";
import { ENV } from "../config/env.js";
import { Customer } from "../models/Customer.js";
import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";
import { Product } from "../models/Product.js";
import { CustomErrorHandler } from "./errorHandler.js";

export const customerBalanceCalculator = async (oldInvoice, grand_total) => {
    try {
        const results = await sequelize.query(
            `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
            {
                replacements: {
                    totalAmount: Number(grand_total),
                },
            },
        );
        const taxData = results[0];
        let remainderOfTotals;
        const customer = await Customer.findByPk(oldInvoice.customer_id);
        if (oldInvoice.invoice_total <= taxData.grandTotal) {
            remainderOfTotals = taxData.grandTotal - oldInvoice.invoice_total;
            if (customer.balance < remainderOfTotals) {
                return Promise.reject(
                    new CustomErrorHandler("Customer has insuffecient balance"),
                );
            }
            customer.balance -= Number(remainderOfTotals);
        } else {
            remainderOfTotals = oldInvoice.invoice_total - taxData.grandTotal;
            customer.balance += Number(remainderOfTotals);
        }
        const invoice = await Invoice.findByPk(oldInvoice.invoice_id);
        invoice.tax_amount = taxData.taxAmount;

        invoice.invoice_total = taxData.grandTotal;

        return Promise.all([customer.save(), invoice.save()]);
    } catch (error) {
        return Promise.reject(new Error(error.message));
    }
};

export const onInvoiceLineUpdate = async (invoice_id) => {
    try {
        const InvoiceLines = await InvoiceLine.findAll({
            where: { invoice_id },
        });
        if (!InvoiceLines?.length || InvoiceLines) return;
        const oldInvoice = await Invoice.findByPk(invoice_id);

        const line_prices = InvoiceLines.map((line) => line.linePrice);
        const grand_total = line_prices.reduce(
            (sum, amount) => sum + amount,
            0,
        );
        return customerBalanceCalculator(oldInvoice, grand_total);
    } catch (error) {
        return Promise.reject(new Error(error.message));
    }
};

export const calculateProductsAfterInvoiceLineUpdate = async (
    line_id,
    product_id,
    quantity,
) => {
    try {
        const oldLine = await InvoiceLine.findByPk(line_id);
        const product = await Product.findByPk(product_id);
        if (product_id !== oldLine.product_id) {
            product.quantityOnHand += oldLine.quantity;
            return product.save();
        }
        let remainder = 0;
        if (oldLine.quantity >= quantity) {
            remainder = oldLine.quantity - quantity;
            product.quantityOnHand += remainder;
            return product.save();
        }
        remainder = quantity - oldLine.quantity;
        if (product.quantityOnHand < remainder)
            return Promise.reject(
                new CustomErrorHandler("Product quantity is insuffecient"),
            );

        product.quantityOnHand -= remainder;
        return product.save();
    } catch (error) {
        return Promise.reject(new Error(error.message));
    }
};
export const calculateProductsAfterInvoiceLineDelete = async (line_id) => {
    try {
        const oldLine = await InvoiceLine.findByPk(line_id);
        const product = await Product.findByPk(oldLine.product_id);
        product.quantityOnHand += oldLine.quantity;
        return product.save();
    } catch (error) {
        return Promise.reject(new Error(error.message));
    }
};
