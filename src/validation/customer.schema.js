import Joi from "joi";

export const createCustomerSchema = Joi.object({
    firstName: Joi.string().strip().max(50).required(),
    lastName: Joi.string().strip().max(50).required(),
    address: Joi.string().strip().max(100).required(),
    phone: Joi.string()
        .strip()
        .regex(/^\+(\d{1,3})\s?\d{4,14}$/)
        .message(
            "This field should be a valid phone Number with the country code",
        )
        .required(),
    balance: Joi.number().options({ convert: false }).strip().required(),
});

export const updateCustomerSchema = Joi.object({
    firstName: Joi.string().strip().max(50).optional(),
    lastName: Joi.string().strip().max(50).optional(),
    address: Joi.string().strip().max(100).optional(),
    phone: Joi.string()
        .strip()
        .regex(/^\+(\d{1,3})\s?\d{4,14}$/)
        .message(
            "This field should be a valid phone Number with the country code",
        )
        .optional(),
    balance: Joi.number().options({ convert: false }).strip().optional(),
});
