import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { ENV } from "../config/env.js";
import { CustomErrorHandler } from "../helpers/errorHandler.js";
import { Customer } from "./Customer.js";

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
        tax_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        invoice_total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        hooks: {
            beforeCreate: async (invoice, otpions) => {
                try {
                    const results = await sequelize.query(
                        `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
                        {
                            replacements: {
                                totalAmount: Number(invoice.invoice_total),
                            },
                        },
                    );
                    const taxData = results[0];
                    const customer = await Customer.findByPk(
                        invoice.customer_id,
                    );
                    if (customer.balance < taxData.grandTotal) {
                        return Promise.reject(
                            new CustomErrorHandler(
                                "Customer has insuffecient balance",
                            ),
                        );
                    }
                } catch (error) {
                    return Promise.reject(new Error(error));
                }
            },
            afterCreate: async (invoice, options) => {
                // Reduce customer balance
                try {
                    const results = await sequelize.query(
                        `CALL ${ENV.DB_NAME}.CalculateTaxAndGrandTotal(:totalAmount, @taxAmount, @grandTotal);`,
                        {
                            replacements: {
                                totalAmount: Number(invoice.invoice_total),
                            },
                        },
                    );
                    const taxData = results[0];
                    const customer = await Customer.findByPk(
                        invoice.customer_id,
                    );

                    customer.balance -= taxData.grandTotal;
                    await customer.save();

                    // Fetch the output variables
                    invoice.tax_amount = taxData.taxAmount;
                    invoice.invoice_total = taxData.grandTotal;
                    await invoice.save();
                } catch (error) {
                    return Promise.reject(new Error(error));
                }
            },
        },
    },
);
