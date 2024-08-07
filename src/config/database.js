import { config } from "dotenv";
config();
import { Sequelize } from "sequelize";
import { ENV } from "./env.js";
import cls from "cls-hooked";
const namespace = cls.createNamespace("sequelize-namespace");
Sequelize.useCLS(namespace);
export const sequelize = new Sequelize(
    ENV.DB_NAME,
    ENV.DB_USER,
    ENV.DB_PASSWORD,
    {
        host: ENV.DB_HOST,
        dialect: "mysql",
        dialectOptions: {
            multipleStatements: true,
        },
    },
);
