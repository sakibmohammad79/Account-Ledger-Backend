"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const ApiError_1 = require("../errors/ApiError");
const globalErrorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    // Zod validation error
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = err.issues.map((i) => i.message).join(", ");
    }
    // Prisma known request error (Prisma v7)
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409;
            message = `Duplicate entry: ${err.meta?.target}`;
        }
        if (err.code === "P2025") {
            statusCode = 404;
            message = "Record not found";
        }
    }
    // Custom AppError
    if (err instanceof ApiError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.globalErrorHandler = globalErrorHandler;
