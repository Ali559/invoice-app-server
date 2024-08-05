import { config } from "dotenv";
config();
export const ENV = {
    PORT: process.env.PORT,
    DB_NAME: process.env.DB_NAME.trim(),
    DB_USER: process.env.DB_USER.trim(),
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET.trim(),
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET.trim(),
};
