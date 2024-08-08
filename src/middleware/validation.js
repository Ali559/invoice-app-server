export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        next();
    };
};

export const validateRequestParams = (schema) => {
    return (req, res, next) => {
        console.log(req.params);
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        next();
    };
};
export const validateQueryParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }
        next();
    };
};
