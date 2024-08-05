import { Router } from "express";
import { userRouter } from "./user.js";
import productRouter from "./product.js";
import { isAuthenticated } from "../middleware/auth.js";
import { invoiceRouter } from "./invoices.js";
export const router = Router();

router.use("/user", userRouter);
router.use("/products", isAuthenticated, productRouter);
router.use("/invoices", isAuthenticated, invoiceRouter);
// router.use("/customers");
// router.use("/suppliers");
