import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import {
    handleAfterInvoiceCreation,
    handlePreInvoiceCreation,
} from "../helpers/hooks.js";

export const Invoice = sequelize.define(
    "Invoice",
    {
        invoice_id: {
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        tax_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        invoice_total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        hooks: {
            beforeCreate: handlePreInvoiceCreation,
            afterCreate: handleAfterInvoiceCreation,
        },
    },
);
