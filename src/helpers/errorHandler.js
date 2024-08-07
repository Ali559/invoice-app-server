export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class CustomErrorHandler extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
    }
}
