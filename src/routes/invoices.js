import { Router } from "express";
export const invoiceRouter = Router();
import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";
import { validate } from "../middleware/validation.js";
import { createInvoiceSchema } from "../validation/invoice.schema.js";
invoiceRouter.post("/", validate(createInvoiceSchema), async (req, res) => {
    try {
        const { customer_id, products } = req.body;
        const line_prices = products.map(
            (product) => product.price * product.quantity,
        );

        const grand_total = line_prices.reduce(
            (sum, amount) => sum + amount,
            0,
        );
        const count = await Invoice.count();
        const newCount = count + 1;
        const invoice_id = `${new Date().getFullYear()}-${String(
            newCount,
        ).padStart(3, "0")}`;
        const invoice = await Invoice.create({
            invoice_id,
            customer_id,
            invoice_total: grand_total,
        });
        const readyInvoiceLines = products.map((p, index) => ({
            linePrice: line_prices[index],
            quantity: p.quantity,
            product_id: p.product_id,
            invoice_id: invoice.invoice_id,
        }));
        const invoiceLines = await InvoiceLine.bulkCreate(readyInvoiceLines);

        res.status(201).json({
            message: "Invoice Created Successfully",
            invoice,
            invoiceLines,
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: `Something went wrong ${error.message}`,
        });
    }
});
