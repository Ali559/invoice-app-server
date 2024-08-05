import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
