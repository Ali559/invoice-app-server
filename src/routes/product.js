import express from "express";
import {
    validate,
    validateQueryParams,
    validateRequestParams,
} from "../middleware/validation.js";
import {
    createProductSchema,
    updateProductSchema,
} from "../validation/product.schema.js";
import Joi from "joi";
import { paginationParams } from "../validation/common.schema.js";
import productController from "../controllers/product.controller.js";
const productRouter = express.Router();

// Create a new product
productRouter.post(
    "/",
    validate(createProductSchema),
    productController.handleAddingProduct,
);

// GET Product by Id
productRouter.get(
    "/:productId",
    validateRequestParams(
        Joi.object({
            productId: Joi.number().integer().strip().required(),
        }),
    ),
    productController.handleGettingOneProduct,
);

// GET All products with pagination || search all Products by name
productRouter.get(
    "/",
    validateQueryParams(paginationParams),
    productController.handleGettingProductsWithPagination,
);

// Upload an image and update the productImage field
productRouter.post(
    "/upload/:productId",
    validateRequestParams(
        Joi.object({
            productId: Joi.number().integer().strip().required(),
        }),
    ),
    productController.handleAddingProductImageBlob,
);

// Update Product by Id
productRouter.patch(
    "/:productId",
    validateRequestParams(
        Joi.object({
            productId: Joi.number().integer().strip().required(),
        }),
    ),
    validate(updateProductSchema),
    productController.handleUpdatingProduct,
);

//  Delete Product by Id
productRouter.delete(
    "/:productId",
    validateRequestParams(
        Joi.object({
            productId: Joi.number().integer().strip().required(),
        }),
    ),
    productController.handleProductDeletion,
);

export default productRouter;
