"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const SendResponse_1 = require("../utils/SendResponse");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return (0, SendResponse_1.sendResponse)(res, {
                    statusCode: 400,
                    success: false,
                    message: "validation error",
                    errorMessages: error.issues
                });
            }
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
