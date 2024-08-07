import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { handleAfterInvoiceLineCreation } from "../helpers/hooks.js";

export const InvoiceLine = sequelize.define(
    "InvoiceLine",
    {
        invoice_line_id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            unique: true,
            autoIncrement: true,
        },
        invoice_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        linePrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        hooks: {
            afterCreate: handleAfterInvoiceLineCreation,
        },
    },
);
