import { Product } from "../models/Product.js";
import { CustomErrorHandler } from "./errorHandler.js";

export const handleAfterInvoiceLineCreation = async (invoiceLine, options) => {
    try {
        const product = await Product.findByPk(invoiceLine.product_id);

        if (product.quantityOnHand < invoiceLine.quantity)
            return Promise.reject(
                new CustomErrorHandler("Insuffecient amount of items left"),
            );
        product.quantityOnHand -= Number(invoiceLine.quantity);
        await product.save();
    } catch (error) {
        return Promise.reject(new Error(error));
    }
};

export const handleAfterInvoiceLineBulkCreation = async (
    invoiceLines,
    options,
) => {
    try {
        const products = await Promise.all(
            invoiceLines.map((line) => Product.findByPk(line.product_id)),
        );
        const promises = [];
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const invoiceLine = invoiceLines[i];
            if (product.quantityOnHand < invoiceLine.quantity)
                return Promise.reject(
                    new CustomErrorHandler("Insuffecient amount of items left"),
                );
            product.quantityOnHand -= Number(invoiceLine.quantity);
            promises.push(product.save());
        }
        await Promise.all(promises);
    } catch (error) {
        return Promise.reject(new Error(error));
    }
};
