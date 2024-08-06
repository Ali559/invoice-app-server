import { sequelize } from "../config/database.js";
import { ENV } from "../config/env.js";
import { Customer } from "../models/Customer.js";
import { Product } from "../models/Product.js";

export const handlePreInvoiceCreation = async (invoice, otpions) => {
    try {
        const results = await sequelize.query(
            `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
            {
                replacements: { totalAmount: Number(invoice.invoice_total) },
            },
        );
        const taxData = results[0];
        const customer = await Customer.findByPk(invoice.customer_id);
        if (customer.balance < taxData.grandTotal) {
            return Promise.reject(
                new Error("Customer has insuffecient balance"),
            );
        }
    } catch (error) {
        return Promise.reject(new Error(error));
    }
};
export const handleAfterInvoiceCreation = async (invoice, options) => {
    // Reduce customer balance
    try {
        const results = await sequelize.query(
            `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
            {
                replacements: { totalAmount: Number(invoice.invoice_total) },
            },
        );
        const taxData = results[0];
        const customer = await Customer.findByPk(invoice.customer_id);
        if (customer.balance < taxData.grandTotal) {
            return Promise.reject(
                new Error("Customer has insuffecient balance"),
            );
        }

        customer.balance -= taxData.grandTotal;
        await customer.save();

        // Fetch the output variables
        invoice.tax_amount = taxData.taxAmount;
        invoice.invoice_total = taxData.grandTotal;
        await invoice.save();
    } catch (error) {
        return Promise.reject(new Error(error));
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
        return Promise.reject(new Error(error));
    }
};

export const handlePreInvoiceLineCreation = async (invoiceLine, options) => {
    try {
        const product = await Product.findByPk(invoiceLine.product_id);
        const isProductQuantitySuffecient =
            product.quantityOnHand > invoiceLine.quantity;
        if (!isProductQuantitySuffecient)
            return Promise.reject(new Error("Insuffecient Product Quantity"));
    } catch (error) {
        return Promise.reject(new Error(error));
    }
};
