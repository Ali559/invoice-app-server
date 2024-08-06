import Joi from "joi";

export const createInvoiceSchema = Joi.object({
    products: Joi.array()
        .items({
            price: Joi.number().options({ convert: false }).required(),
            quantity: Joi.number().options({ convert: false }).required(),
            product_id: Joi.number()
                .integer()
                .options({ convert: false })
                .required(),
        })
        .required(),
    customer_id: Joi.number().integer().options({ convert: false }),
});
