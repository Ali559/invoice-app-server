import Multer from "multer";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../public/uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only JPEG, JPG, PNG, and Webp are allowed.",
            ),
            false,
        );
    }
};

export const upload = Multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
    },
});
