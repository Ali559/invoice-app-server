import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
export const Supplier = sequelize.define("Supplier", {
    supplier_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
