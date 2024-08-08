import { Router } from "express";
import { userRouter } from "./user.js";
import productRouter from "./product.js";
import { isAuthenticated } from "../middleware/auth.js";
import { invoiceRouter } from "./invoices.js";
import { customerRouter } from "./customers.js";
import { supplierRouter } from "./suppliers.js";
export const router = Router();

router.use("/users", userRouter);
router.use("/products", isAuthenticated, productRouter);
router.use("/invoices", isAuthenticated, invoiceRouter);
router.use("/customers", isAuthenticated, customerRouter);
router.use("/suppliers", isAuthenticated, supplierRouter);
