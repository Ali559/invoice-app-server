import { Router } from "express";
import {
    validate,
    validateQueryParams,
    validateRequestParams,
} from "../middleware/validation.js";
import {
    createCustomerSchema,
    updateCustomerSchema,
} from "../validation/customer.schema.js";
import Joi from "joi";
import { paginationParams } from "../validation/common.schema.js";
import customerController from "../controllers/customer.controller.js";

export const customerRouter = Router();

// Create Customer
customerRouter.post(
    "/",
    validate(createCustomerSchema),
    customerController.handleAdd,
);

// Get Customer By Id
customerRouter.get(
    "/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }),
    ),
    customerController.handleGetOne,
);

// Get Custoemrs with Pagination || Search Customers with Pagination
customerRouter.get(
    "/",
    validateQueryParams(paginationParams),
    customerController.handleGetAll,
);

// Update Customer by Id
customerRouter.patch(
    "/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }),
    ),
    validate(updateCustomerSchema),
    customerController.handleUpdate,
);

// delete Customer by Id (only will happen if the customer has no invoices)
customerRouter.delete(
    "/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }),
    ),
    customerController.handleDelete,
);
