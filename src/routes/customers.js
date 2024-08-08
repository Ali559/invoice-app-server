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
import { Customer } from "../models/Customer.js";
import Joi from "joi";
import { paginationParams } from "../validation/common.schema.js";
import { paginate } from "../helpers/paginate.js";
import { Op } from "sequelize";

export const customerRouter = Router();

// Create Customer
customerRouter.post("/", validate(createCustomerSchema), async (req, res) => {
    try {
        const { firstName, lastName, address, phone, balance } = req.body;
        const customer = await Customer.create({
            firstName,
            lastName,
            address,
            phone,
            balance,
        });
        return res.status(201).json({ customer });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: `Something went wrong ${error.message}`,
        });
    }
});

// Get Customer By Id
customerRouter.get(
    "/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }),
    ),
    async (req, res) => {
        try {
            const { customer_id } = req.params;
            const customer = await Customer.findByPk(customer_id);
            return res.status(200).json({ customer });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
);

// Get Custoemrs with Pagination || Search Customers with Pagination
customerRouter.get(
    "/",
    validateQueryParams(paginationParams),
    async (req, res) => {
        try {
            const { pageSize, limit, search } = req.query;
            let searchQuery;
            if (search)
                searchQuery = {
                    where: {
                        firstName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                };
            const result = await paginate(
                Customer,
                pageSize,
                limit,
                searchQuery,
            );
            return res.status(200).json({ result });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
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
    async (req, res) => {
        try {
            const { firstName, lastName, address, phone, balance } = req.body;
            const { customer_id } = req.params;
            await Customer.update(
                {
                    firstName,
                    lastName,
                    address,
                    phone,
                    balance,
                },
                {
                    where: { customer_id },
                },
            );
            return res.status(201).json({
                message: "Customer Updated Successfully",
                customr: await Customer.findByPk(customer_id),
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
);

// delete Customer by Id (only will happen if the customer has no invoices)
customerRouter.delete(
    "/:customer_id",
    validateRequestParams(
        Joi.object({
            customer_id: Joi.number().integer().strip().required(),
        }),
    ),
    async (req, res) => {
        try {
            const { customer_id } = req.params;

            await Customer.destroy({ where: { customer_id } });
            return res.status(201).json({
                message: "Customer Deleted Successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
);
