import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string().strip().required().max(50),
    quantityOnHand: Joi.number()
        .integer()
        .options({ convert: false })
        .required(),
    price: Joi.number().options({ convert: false }).required(),
    supplier_id: Joi.number().integer().options({ convert: false }).required(),
    barcode: Joi.string().strip().required().max(200),
    productImage: Joi.string()
        .uri({ allowQuerySquareBrackets: false })
        .strip()
        .required(),
});

export const updateProductSchema = Joi.object({
    name: Joi.string().strip().optional().max(50),
    quantityOnHand: Joi.number()
        .integer()
        .options({ convert: false })
        .optional(),
    price: Joi.number().options({ convert: false }).optional(),
    supplier_id: Joi.number().integer().options({ convert: false }).optional(),
    barcode: Joi.string().strip().optional().max(200),
});
