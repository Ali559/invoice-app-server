import express, { urlencoded } from "express";
import { router } from "./routes/router.js";
import { ENV } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { sanitizeIncomingData } from "./middleware/sanitize.js";
import { defineAssociations } from "./models/index.js";
import { limiter } from "./config/rateLimit.js";

const app = express();
const PORT = ENV.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "50kb" }));
app.use(urlencoded({ extended: true, limit: "50kb" }));
app.use(express.static(path.join(__dirname, "../public/uploads")));
app.use(helmet());
app.use("/api", limiter, sanitizeIncomingData, router);
const { sequelize } = defineAssociations();
sequelize
    .sync({ logging: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log("Error syncing with database:", err));
