import { Router } from "express";
export const invoiceRouter = Router();
import { validate, validateRequestParams } from "../middleware/validation.js";
import {
    createInvoiceSchema,
    updateInvoiceLineSchema,
    updateInvoiceSchema,
} from "../validation/invoice.schema.js";
import invoiceController from "../controllers/invoice.controller.js";
import Joi from "joi";

invoiceRouter.post(
    "/",
    validate(createInvoiceSchema),
    invoiceController.handleInvoiceCreation,
);

// Update Invoice
invoiceRouter.patch(
    "/:invoice_id",
    validateRequestParams(
        Joi.object({
            invoice_id: Joi.string()
                .pattern(/^\d{4}-\d{3}$/)
                .strip()
                .required(),
        }).required(),
    ),
    validate(updateInvoiceSchema),
    invoiceController.handleInvoiceUpdate,
);

// Delete Invoice
invoiceRouter.delete(
    "/:invoice_id",
    validateRequestParams(
        Joi.object({
            invoice_id: Joi.string()
                .pattern(/^\d{4}-\d{3}$/)
                .strip()
                .required(),
        }).required(),
    ),
    invoiceController.handleInvoiceDeletion,
);

// Get Invoice by Id
invoiceRouter.get(
    "/:invoice_id",
    validateRequestParams(
        Joi.object({
            invoice_id: Joi.string()
                .pattern(/^\d{4}-\d{3}$/)
                .strip()
                .required(),
        }).required(),
    ),
    invoiceController.handleGettingInvoice,
);

// Get All invoices for Customer with Pagination
invoiceRouter.get(
    "/all/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }).required(),
    ),
    invoiceController.handleGettingInvoicesByPaginationAndCustomerId,
);

// Update an invoiceLine
invoiceRouter.patch(
    "/:invoice_id/:line_id",
    validateRequestParams(
        Joi.object({
            invoice_id: Joi.string()
                .pattern(/^\d{4}-\d{3}$/)
                .strip()
                .required(),
            line_id: Joi.number().integer().strip().required(),
        }).required(),
    ),
    validate(updateInvoiceLineSchema),
);
