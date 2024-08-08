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

// https://www.postman.com/winter-station-75088/workspace/team-workspace/documentation/8410937-fc937947-6e8a-4b3e-99c2-b73733c7267d
