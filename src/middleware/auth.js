import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
const { verify } = jwt;
export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.sendStatus(401);

    verify(token, ENV.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
