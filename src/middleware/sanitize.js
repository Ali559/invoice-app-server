import { sanitize } from "../helpers/sanitize.js";

export const sanitizeIncomingData = (req, res, next) => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
};
