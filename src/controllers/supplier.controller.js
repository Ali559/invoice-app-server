import { Supplier } from "../models/Supplier.js";
import { paginate } from "../helpers/paginate.js";
import { Op } from "sequelize";

export default Object.freeze({
    handleAdd: async (req, res) => {
        try {
            const { name, phone } = req.body;
            const supplier = await Supplier.create({ name, phone });
            return res.status(201).json({ supplier });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleGetOne: async (req, res) => {
        try {
            const { supplier_id } = req.params;
            const supplier = await Supplier.findByPk(supplier_id);
            return res.status(200).json({ supplier });
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
                        name: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                };

            const result = await paginate(
                Supplier,
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
            const { name, phone } = req.body;
            const { supplier_id } = req.params;

            await Supplier.update({ name, phone }, { where: { supplier_id } });
            return res.status(201).json({
                message: "Supplier Updated Successfully",
                supplier: await Supplier.findByPk(supplier_id),
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
            const { supplier_id } = req.params;

            await Supplier.destroy({ where: { supplier_id } });
            return res.status(201).json({
                message: "Supplier Deleted Successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
});
