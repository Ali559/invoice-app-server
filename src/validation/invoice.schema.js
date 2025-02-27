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

    customer_id: Joi.number().integer().options({ convert: false }).required(),
    invoice_date: Joi.date().required(),
});

//
export const updateInvoiceSchema = Joi.object({
    invoice_date: Joi.date().required(),
});

export const updateInvoiceLineSchema = Joi.object({
    quantity: Joi.number().options({ convert: false }).required(),
    product_id: Joi.number().integer().options({ convert: false }).required(),
    price: Joi.number().options({ convert: false }).required(),
});
export const addInvoiceLineSchema = Joi.object({
    quantity: Joi.number().options({ convert: false }).required(),
    product_id: Joi.number().integer().options({ convert: false }).required(),
    product_price: Joi.number().options({ convert: false }).required(),
});
