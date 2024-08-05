import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Invoice } from "./Invoice.js";

export const Customer = sequelize.define("Customer", {
    customer_id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
});

// Customer.hasMany(Invoice, { foreignKey: "customer_id" });
