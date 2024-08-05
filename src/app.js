import express, { urlencoded } from "express";
import { router } from "./routes/router.js";
import { ENV } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const PORT = ENV.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json({ limit: "50kb" }));
app.use(urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static(path.join(__dirname, "../public/uploads")));
app.use("/api", router);
// Routes

sequelize
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log("Error syncing with database:", err));
