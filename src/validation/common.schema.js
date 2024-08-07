import Joi from "joi";

export const paginationParams = Joi.object({
    pageSize: Joi.number().integer().optional().strip(),
    limit: Joi.number().integer().optional().strip(),
    search: Joi.string().optional().strip(),
});
