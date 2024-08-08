import { Router } from "express";
import {
    validate,
    validateQueryParams,
    validateRequestParams,
} from "../middleware/validation.js";
import Joi from "joi";
import { paginationParams } from "../validation/common.schema.js";
import {
    createSupplierSchema,
    updateSupplierSchema,
} from "../validation/supplier.schema.js";
import supplierController from "../controllers/supplier.controller.js";

export const supplierRouter = Router();

// Create a Supplier
supplierRouter.post(
    "/",
    validate(createSupplierSchema),
    supplierController.handleAdd,
);

// Get Supplier by Id
supplierRouter.get(
    "/:supplier_id",
    validateRequestParams(
        Joi.object({
            supplier_id: Joi.number().integer().strip().required(),
        }),
    ),
    supplierController.handleGetOne,
);

// Get Suppliers with Pagination & Search
supplierRouter.get(
    "/",
    validateQueryParams(paginationParams),
    supplierController.handleGetAll,
);

// Update Supplier by Id
supplierRouter.patch(
    "/:supplier_id",
    validate(updateSupplierSchema),
    validateRequestParams(
        Joi.object({
            supplier_id: Joi.number().integer().strip().required(),
        }),
    ),
    supplierController.handleUpdate,
);

// Delete Supplier by Id
supplierRouter.delete(
    "/:supplier_id",
    validateRequestParams(
        Joi.object({
            supplier_id: Joi.number().integer().strip().required(),
        }),
    ),
    supplierController.handleDelete,
);
