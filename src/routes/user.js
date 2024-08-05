import express from "express";
import { isAuthenticated, renewToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
    changePasswordSchema,
    deleteUserSchema,
    loginSchema,
    refreshTokenSchema,
    registerSchema,
} from "../validation/user.schema.js";
import userController from "../controllers/user.controller.js";
export const userRouter = express.Router();

// Register
userRouter.post(
    "/register",
    validate(registerSchema),
    userController.handleRegistration,
);

// Login
userRouter.post("/login", validate(loginSchema), userController.handleLogin);

userRouter.post(
    "/renew-token",
    validate(refreshTokenSchema),
    renewToken,
    userController.handleTokenRefresh,
);

userRouter.patch(
    "/change-password",
    validate(changePasswordSchema),
    isAuthenticated,
    userController.handleTokenRefresh,
);

userRouter.delete(
    "/delete-user",
    validate(deleteUserSchema),
    isAuthenticated,
    userController.handleUserDeletion,
);
