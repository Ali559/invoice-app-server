import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1000,
    limit: 2, // Limit each IP to 1 request per `window` (here, per minute).
    standardHeaders: "draft-7",
    legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
    validate: true,
    message: {
        message: "Number of requests has exceeded the limit",
        statusCode: 429,
    },
});
