import { Customer } from "../models/Customer.js";
import { paginate } from "../helpers/paginate.js";
import { Op } from "sequelize";
export default Object.freeze({
    handleAdd: async (req, res) => {
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
    },
    handleGetOne: async (req, res) => {
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
    handleGetAll: async (req, res) => {
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
    handleUpdate: async (req, res) => {
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
    handleDelete: async (req, res) => {
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
});
