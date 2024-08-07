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
    newProducts: Joi.array()
        .items({
            price: Joi.number().options({ convert: false }).required(),
            quantity: Joi.number().options({ convert: false }).required(),
            product_id: Joi.number()
                .integer()
                .options({ convert: false })
                .required(),
        })
        .optional(),
    invoice_date: Joi.date().optional(),
}).or("newProducts", "invoice_date");

export const updateInvoiceLineSchema = Joi.object({
    invoiceLine: Joi.object({
        quantity: Joi.number().options({ convert: false }).optional(),
        product_id: Joi.number()
            .integer()
            .options({ convert: false })
            .optional(),
        price: Joi.number().options({ convert: false }).optional(),
    }),
});
