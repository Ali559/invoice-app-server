import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Tax = sequelize.define(
    "Tax",
    {
        tax_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rate: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },
        threshold: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    { timestamps: true },
);
