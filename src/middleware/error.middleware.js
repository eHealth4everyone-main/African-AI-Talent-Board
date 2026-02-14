import logger from '../config/logger.js';

/**
 * Error Handling Middleware
 * Centralized error handler for consistent error responses
 */

/**
 * Custom error class for operational errors
 */
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Prisma errors
    if (err.code === 'P2002') {
        statusCode = 400;
        message = 'Duplicate entry: A record with this value already exists';
    } else if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Record not found';
    }

    // Handle validation errors
    if (err.message && err.message.includes('Validation failed')) {
        statusCode = 400;
    }

    // Handle "not found" errors
    if (err.message && (err.message.includes('not found') || err.message.includes('Not found'))) {
        statusCode = 404;
    }

    // Log error with Winston
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        statusCode,
    });

    // Development vs Production error response
    const errorResponse = {
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: err.stack,
                details: err,
            }),
        },
    };

    res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};
