# Invoicing App

This Invoicing App allows users to manage customers, suppliers, products, invoices, and invoice lines with built-in features like automatic tax calculations, product deductions, and customer balance updates. The app follows strict security practices to protect against XSS and SQL injection attacks.

## Prerequisites

-   **Node.js**: Version >= 18.16.1 is required. Anything below this version is not supported.
-   **pnpm**: Ensure you have pnpm installed globally on your machine.

### Installing pnpm

If you don't have `pnpm` installed, you can install it globally using npm:

bash
npm install -g pnpm

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Ali559/invoice-app-server.git
cd your-repo-directory
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file to create your own `.env` file.

```bash
cp .env.example .env
```

Update the `.env` file with your specific configuration, such as `DB_PASSWORD` and any other environment-specific settings.

### 4. Database Migration

To set up the database and stored procedures, run the following MySQL command:

```bash
mysql -u root -p < schema.sql
```

Ensure that the `DB_NAME`, `DB_USER`, and `DB_PASSWORD` variables in your `.env` file match your MySQL configuration.

### 5. Running the Application

Start the application using pnpm:

```bash
pnpm start
```

For development mode with file watching, use:

```bash
pnpm start:dev
```

### 6. Postman Environment

The API is hosted on port `3000` by default. If you change the port in the `.env` file, remember to update the port in your Postman environment as well.

Postman environment link: [Invoicing App Postman Environment](https://www.postman.com/winter-station-75088/workspace/team-workspace/documentation/8410937-fc937947-6e8a-4b3e-99c2-b73733c7267d)

## Packages Used

-   **bcryptjs**: For hashing passwords securely.
-   **cls-hooked**: For managing asynchronous context in Node.js (used for adding a namespace to the Sequelize Configuration which makes doing transactions easier).
-   **dotenv**: For loading environment variables from `.env` files.
-   **express**: Web framework for building RESTful APIs.
-   **express-rate-limit**: Middleware to limit repeated requests to the API.
-   **helmet**: Helps secure the app by setting various HTTP headers.
-   **joi**: For data validation and schema validation.
-   **jsonwebtoken**: For implementing JWT-based authentication.
-   **multer**: For handling multipart/form-data, mainly for file uploads.
-   **mysql2**: MySQL database driver.
-   **sequelize**: ORM for managing database interactions.
-   **xss**: To sanitize user input and protect against XSS attacks.
-   **cors**: Middleware to enable Cross-Origin Resource Sharing.

## Security Practices

-   The app is configured with strict rules to prevent XSS attacks using the `xss` library.
-   Best practices are followed to prevent SQL injection attacks, particularly with the use of `sequelize` and input validation with `joi`.
-   Helmet is used to set security-related HTTP headers.
