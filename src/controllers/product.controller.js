import { Product } from "../models/Product.js";
import { paginate } from "../helpers/paginate.js";
import { Op } from "sequelize";
export default Object.freeze({
    handleAddingProduct: async (req, res) => {
        try {
            const {
                name,
                quantityOnHand,
                price,
                supplier_id,
                barcode,
                productImage,
            } = req.body;
            const product = await Product.create({
                name,
                quantityOnHand,
                price,
                supplier_id,
                productImage,
                barcode,
            });
            return res.status(201).json({ product });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleGettingOneProduct: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.productId);
            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleGettingProductsWithPagination: async (req, res) => {
        try {
            const { pageSize, limit, search } = req.query;
            let searchQuery;
            if (search) {
                searchQuery = {
                    where: {
                        name: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                };
            }
            const products = await paginate(
                Product,
                pageSize,
                limit,
                searchQuery,
                [["name", "asc"]],
            );
            return res.status(200).json({ products });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleAddingProductImageBlob: async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Update the productImage field with the name of the uploaded file
            product.productImage = req.file.filename;
            const updatedProduct = await product.save();

            res.json({
                message: "Image uploaded and product updated",
                product: updatedProduct,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleUpdatingProduct: async (req, res) => {
        const {
            name,
            quantityOnHand,
            price,
            supplier_id,
            barcode,
            productImage,
        } = req.body;
        const productId = req.params.productId;
        try {
            await Product.update(
                {
                    name,
                    quantityOnHand,
                    price,
                    supplier_id,
                    barcode,
                    productImage,
                },
                {
                    where: {
                        product_id: productId,
                    },
                },
            );
            return res.status(201).json({
                message: "Product updated successfully",
                product: await Product.findByPk(productId),
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
    handleProductDeletion: async (req, res) => {
        try {
            const productId = req.params.productId;
            await Product.destroy({
                where: { product_id: productId },
            });
            return res
                .status(201)
                .json({ message: "Product Deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
});
