import Joi from "joi";

export const createSupplierSchema = Joi.object({
    name: Joi.string().strip().max(100).required(),
    phone: Joi.string()
        .strip()
        .regex(/^\+(\d{1,3})\s?\d{4,14}$/)
        .message(
            "This field should be a valid phone Number with the country code",
        )
        .required(),
});

export const updateSupplierSchema = Joi.object({
    name: Joi.string().strip().max(100).optional(),
    phone: Joi.string()
        .strip()
        .regex(/^\+(\d{1,3})\s?\d{4,14}$/)
        .message(
            "This field should be a valid phone Number with the country code",
        )
        .optional(),
});
