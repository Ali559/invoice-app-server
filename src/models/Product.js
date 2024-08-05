import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { InvoiceLine } from "./InvoiceLine.js";
import { Supplier } from "./Supplier.js";

export const Product = sequelize.define("Product", {
    product_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    barcode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    quantityOnHand: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    supplier: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

Product.hasMany(InvoiceLine, { foreignKey: "product_id" });

