import { Router } from "express";
export const invoiceRouter = Router();
import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";

invoiceRouter.post("/", async (req, res) => {
    try {
        const { customer_id, invoice_total, product_id, quantity, price } =
            req.body;
        const invoice = await Invoice.create({
            customer_id,
            invoice_total,
        });
        const invoiceLine = await InvoiceLine.create({
            product_id,
            invoice_id: invoice.invoice_id,
            quantity,
            line_price: price,
        });
        res.status(201).json({
            message: "Invoice Created Successfully",
            result,
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                status: "Error",
                message: `Something went wrong ${error.message}`,
            });
    }
});
