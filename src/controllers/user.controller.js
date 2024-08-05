import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { ENV } from "../config/env.js";
export default Object.freeze({
    handleRegistration: async (req, res) => {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const userExists = await User.findOne({ where: { email } });
            if (userExists)
                return res.status(409).json({
                    status: "Error",
                    message: "Email is already registered",
                });
            const user = await User.create({ email, password: hashedPassword });
            return res.status(201).json({ message: "User created", user });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },

    handleLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res
                    .status(403)
                    .json({ status: "Error", message: "Invalid credentials" });
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
            res.status(200).json({
                message: "Login successful",
                accessToken,
                refreshToken,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },

    handleTokenRefresh: async (req, res) => {
        const { email, userId } = req.user;
        try {
            const newAccessToken = jwt.sign(
                { userId, email },
                ENV.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" },
            );
            res.status(201).json({
                message: "Token refreshed",
                accessToken: newAccessToken,
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },

    handlePasswordChange: async (req, res) => {
        const user = req.user;
        const { newPassword } = req.body;
        try {
            const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);
            await User.update(
                {
                    password: newPasswordEncrypted,
                },
                {
                    where: { email: user.email, id: user.userId },
                },
            );
            return res.status(201).json({
                message: "password Updated Successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },

    handleUserDeletion: async (req, res) => {
        try {
            const { password } = req.body;
            const { userId, email } = req.user;
            const user = (await User.findByPk(userId)).toJSON();
            console.log(user);
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isPasswordCorrect)
                return res.status(403).json({
                    status: "Error",
                    message: "The password you entered is incorrect",
                });
            await User.destroy({
                where: {
                    email,
                    id: userId,
                },
            });
            return res
                .status(201)
                .json({ message: "User Deleted Successfully" });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
        }
    },
});
