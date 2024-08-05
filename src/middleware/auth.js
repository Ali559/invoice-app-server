import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
const { verify } = jwt;
export const isAuthenticated = (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({
            status: "Error",
            message: "User is not Authenticated",
        });

    verify(token, ENV.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({
                status: "Error",
                message: "Invalid Authorization Token",
            });
        req.user = user;
        next();
    });
};
export const renewToken = (req, res, next) => {
    const token = req.body.refreshToken;
    if (!token)
        return res.status(401).json({
            status: "Error",
            message: "User is not Authenticated",
        });

    verify(token, ENV.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({
                status: "Error",
                message: "Invalid Authorization Token",
            });
        req.user = user;
        next();
    });
};
