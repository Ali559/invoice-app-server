import express from "express";
import { Product } from "../models/Product.js";
import { upload } from "../config/fileUploader.js";

const productRouter = express.Router();

// Create a new product
productRouter.post("/", async (req, res) => {
    const { name, quantityOnHand, price, supplier, barcode } = req.body;
    try {
        const savedProduct = await Product.create({
            name,
            quantityOnHand,
            price,
            supplier,
            barcode,
        });
        res.status(201).json(savedProduct);
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

// Upload an image and update the productImage field
productRouter.post(
    "/:productId/upload",
    upload.single("productImage"),
    async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await Product.findById(productId);

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
            return res
                .status(500)
                .json({ status: "Error", message: "Something went wrong" });
        }
    },
);

productRouter.patch("/:productId", async (req, res) => {
    const { name, quantityOnHand, price, supplier, barcode } = req.body;
    const productId = req.params.productId;
    try {
        const result = await Product.update(
            {
                name,
                quantityOnHand,
                price,
                supplier,
                barcode,
            },
            {
                where: {
                    product_id: productId,
                },
            },
        );
        return res
            .status(201)
            .json({ message: "Product updated successfully", result });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

productRouter.delete("/:productId", async (req, res) => {
    const productId = req.params.productId;
    try {
        const result = await Product.destroy({
            where: { product_id: productId },
        });
        return res
            .status(201)
            .json({ message: "Product updated successfully", result });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

export default productRouter;
