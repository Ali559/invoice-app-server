import { Invoice } from "./Invoice.js";
import { InvoiceLine } from "./InvoiceLine.js";
import { Product } from "./Product.js";
import { sequelize } from "../config/database.js";
import { Customer } from "./Customer.js";
import { Supplier } from "./Supplier.js";

// Define associations
export const defineAssociations = () => {
    // Define model associations
    Invoice.belongsTo(Customer, { foreignKey: "customer_id" });
    Customer.hasMany(Invoice, { foreignKey: "customer_id" });

    InvoiceLine.belongsTo(Invoice, { foreignKey: "invoice_id" });
    InvoiceLine.belongsTo(Product, { foreignKey: "product_id" });

    Product.hasMany(InvoiceLine, { foreignKey: "product_id" });
    Product.belongsTo(Supplier, {
        foreignKey: "supplier_id",
        onDelete: "SET NULL",
    });

    Supplier.hasMany(Product, {
        foreignKey: "supplier_id",
    });
    return { sequelize };
};

// Export models and sequelize instance
