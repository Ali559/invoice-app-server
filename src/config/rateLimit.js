import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 10000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
    validate: true,
    message: {
        message: "Number of requests has exceeded the limit",
        statusCode: 429,
    },
});
