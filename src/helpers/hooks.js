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
