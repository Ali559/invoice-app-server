import { sequelize } from "../config/database.js";
import { Customer } from "../models/Customer.js";
import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";
import { Product } from "../models/Product.js";

export const handlePreInvoiceCreation = async (invoice, options) => {
    try {
        const customer = await Customer.findByPk(invoice.customer_id);
        if (customer.balance < invoice.total_amount) {
            throw new Error("Customer has Insuffecient balance");
        }
        const date = new Date(invoice.invoiceDate);
        const year = date.getFullYear();

        // Get the count of invoices for the current year
        const count = await Invoice.count({
            where: {
                date: {
                    [sequelize.Op.gte]: new Date(`${year}-01-01`),
                    [sequelize.Op.lt]: new Date(`${year + 1}-01-01`),
                },
            },
        });

        const newCount = count + 1;
        const formattedCount = String(newCount).padStart(3, "0");

        invoice.invoice_id = `${year}-${formattedCount}`;

        const [results] = await sequelize.query(
            "CALL CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal); " +
                "SELECT @taxAmount AS taxAmount, @grandTotal AS grandTotal;",
            {
                replacements: { totalAmount: invoice.total_amount },
            },
        );

        const taxData = results[1][0];
        invoice.tax_amount = taxData.taxAmount;
        invoice.grand_total = taxData.grandTotal;

        await invoice.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const handleAfterInvoiceCreation = async (invoice, options) => {
    // Reduce customer balance
    try {
        const customer = await Customer.findByPk(invoice.customer_id);

        customer.balance -= invoice.invoice_total;
        await customer.save();
        await InvoiceLine.update({});
    } catch (error) {
        throw new Error(error);
    }
};

export const handleAfterInvoiceLineCreation = async (invoiceLine, options) => {
    try {
        const product = await Product.findByPk(invoiceLine.product_id);
        const newQuantityOfProducts =
            Number(product.quantityOnHand) - Number(invoiceLine.quantity);
        await product.update(
            {
                quantityOnHand: newQuantityOfProducts,
            },
            {
                where: {
                    product_id: product.product_id,
                },
            },
        );
    } catch (error) {
        throw new Error(error);
    }
};

export const handlePreInvoiceLineCreation = async (invoiceLine, options) => {
    try {
        const product = await Product.findByPk(invoiceLine.product_id);
        const isProductQuantitySuffecient =
            product.quantityOnHand > invoiceLine.quantity;
        if (!isProductQuantitySuffecient)
            throw new Error("Insuffecient Product Quantity");
    } catch (error) {
        throw new Error(error);
    }
};
