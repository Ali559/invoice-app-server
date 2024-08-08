import Joi from "joi";
const passwordMessage = `The password must be At least 8 characters long (preferably more).
Must Contain both uppercase and lowercase letters.
Must Includes at least one digit.
And must have at least one special character (e.g., @, #, $, %, &, etc.)`;
export const registerSchema = Joi.object({
    email: Joi.string().email().required().strip(),
    password: Joi.string()
        .min(8)
        .max(20)
        .strip()
        .required()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .message(passwordMessage),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().strip(true),
    password: Joi.string()
        .required()
        .min(8)
        .max(20)
        .required()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .message(passwordMessage),
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().not().empty().required().strip(true),
});

export const deleteUserSchema = Joi.object({
    password: Joi.string()
        .required()
        .min(8)
        .max(20)
        .required()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .message(passwordMessage),
});

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .min(8)
        .max(20)
        .required()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .message(passwordMessage),
    newPassword: Joi.string()
        .required()
        .min(8)
        .max(20)
        .required()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .message(passwordMessage),
});
