import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../config/env.js";
import { isAuthenticated } from "../middleware/auth.js";

export const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        return res.status(201).json({ message: "User created", user });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

// Login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            ENV.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" },
        );
        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            ENV.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" },
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            sameSite: "strict",
            expires: "15m",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            sameSite: "strict",
            expires: "7d",
        });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

userRouter.post("/renew-token", async (req, res) => {
    const { email, userId } = req.body;
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const decoded = jwt.verify(
            refreshToken,
            ENV.REFRESH_TOKEN_SECRET.trim(),
        );
        const isTokenValid = decoded.email === email && decoded.id === userId;
        if (!isTokenValid)
            return res
                .status(403)
                .json({ status: "Error", message: "Your Token is invalid" });
        const newAccessToken = jwt.sign(
            { userId, email },
            ENV.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" },
        );
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true, // Use secure cookies in production
            sameSite: "strict",
        });
        res.status(201).json({ message: "Token refreshed" });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

userRouter.patch("/change-password", isAuthenticated, async (req, res) => {
    const user = req.user;
    const { newPassword } = req.body;
    try {
        const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);
        const result = await User.update(
            {
                password: newPasswordEncrypted,
            },
            {
                where: { email: user.email, id: user.id },
            },
        );
        return res.status(201).json({
            message: "password Updated",
            result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});

userRouter.delete("/delete-user", isAuthenticated, async (req, res) => {
    try {
        const { userId, email } = req.user;
        await User.destroy({ email, id: userId });
        return res.status(201).json({ message: "User Deleted Successfully" });
    } catch (error) {
        return res
            .status(500)
            .json({ status: "Error", message: "Something went wrong" });
    }
});
