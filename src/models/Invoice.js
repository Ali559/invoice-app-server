import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Customer } from "./Customer.js";
import { InvoiceLine } from "./InvoiceLine.js";
import { handlePreInvoiceCreation } from "../helpers/hooks.js";

export const Invoice = sequelize.define(
    "Invoice",
    {
        invoice_id: {
            primaryKey: true,
            type: DataTypes.STRING,
            unique: true,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        invoice_total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        hooks: {
            beforeCreate: handlePreInvoiceCreation,
            afterCreate: async (invoice, options) => {
                // Reduce customer balance
                const customer = await Customer.findByPk(invoice.customer_id);
                customer.balance -= invoice.invoice_total;
                await customer.save();
            },
        },
    },
);

Invoice.hasMany(InvoiceLine, { foreignKey: "invoice_id" });

Invoice.belongsTo(Customer, { foreignKey: "customer_id" });
