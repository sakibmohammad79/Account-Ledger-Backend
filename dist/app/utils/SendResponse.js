"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    return res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data || null,
        meta: data.meta || null,
        errorMessages: data.errorMessages || null,
    });
};
exports.sendResponse = sendResponse;
