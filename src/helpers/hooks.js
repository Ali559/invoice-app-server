import { Customer } from "../models/Customer.js";
import { Invoice } from "../models/Invoice.js";

export const handlePreInvoiceCreation = async (invoice, options) => {
    try {
        const customer = await Customer.findByPk(invoice.customer_id);
        if (customer.balance < invoice.total_amount) {
            throw new Error("Customer has Insuffecient balance");
        }
        const date = new Date(invoice.invoiceDate);
        const year = date.getFullYear();

        // Get the count of invoices for the current year
        const count = await Invoice.count({
            where: {
                date: {
                    [sequelize.Op.gte]: new Date(`${year}-01-01`),
                    [sequelize.Op.lt]: new Date(`${year + 1}-01-01`),
                },
            },
        });

        const newCount = count + 1;
        const formattedCount = String(newCount).padStart(3, "0");

        invoice.invoice_id = `${year}-${formattedCount}`;
        await invoice.save();
    } catch (error) {
        throw new Error(error);
    }
};

export const handleAfterInvoiceCreation = async (invoice, options) => {
    // Reduce customer balance
    try {
        const customer = await Customer.findByPk(invoice.customer_id);
        customer.balance -= invoice.invoice_total;
        await customer.save();
    } catch (error) {
        throw new Error(error);
    }
};
