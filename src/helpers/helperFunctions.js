import { sequelize } from "../config/database.js";
import { ENV } from "../config/env.js";
import { Customer } from "../models/Customer.js";
import { Invoice } from "../models/Invoice.js";
import { InvoiceLine } from "../models/InvoiceLine.js";
import { Product } from "../models/Product.js";
import { CustomErrorHandler } from "./errorHandler.js";

export const customerBalanceCalculationAfterInvoiceUpdate = async (
    oldInvoice,
    grand_total,
) => {
    try {
        const results = await sequelize.query(
            `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
            {
                replacements: {
                    totalAmount: Number(grand_total),
                },
            },
        );
        const taxData = results[0];
        let remainderOfTotals;
        console.log(taxData);
        const customer = await Customer.findByPk(oldInvoice.customer_id);
        if (oldInvoice.invoice_total <= taxData.grandTotal) {
            remainderOfTotals = taxData.grandTotal - oldInvoice.invoice_total;
            if (customer.balance < remainderOfTotals) {
                return Promise.reject(
                    new CustomErrorHandler("Customer has insuffecient balance"),
                );
            }
            customer.balance -= Number(remainderOfTotals);
        } else {
            remainderOfTotals = oldInvoice.invoice_total - taxData.grandTotal;
            customer.balance += Number(remainderOfTotals);
        }
        const invoice = await Invoice.findByPk(oldInvoice.invoice_id);
        invoice.tax_amount = taxData.taxAmount;

        invoice.invoice_total = taxData.grandTotal;

        return Promise.all([customer.save(), invoice.save()]);
    } catch (error) {
        return Promise.reject(new Error(error.message));
    }
};
