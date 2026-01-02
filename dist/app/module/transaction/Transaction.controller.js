"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const SendResponse_1 = require("../../utils/SendResponse");
const CatchAsync_1 = require("../../utils/CatchAsync");
const Transaction_Service_1 = require("./Transaction.Service");
const createTransaction = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const transaction = await Transaction_Service_1.TransactionServices.createTransaction(req.body);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
    });
});
const getAllTransactions = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { page = '1', limit = '10', type, startDate, endDate, } = req.query;
    const result = await Transaction_Service_1.TransactionServices.getAllTransactions({
        page: Number(page),
        limit: Number(limit),
        type: type,
        startDate: startDate,
        endDate: endDate,
    });
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transactions retrieved successfully',
        data: result.data,
        meta: {
            total: result.pagination.total,
        }
    });
});
const getTransactionById = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction_Service_1.TransactionServices.getTransactionById(id);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction,
    });
});
const updateTransaction = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const transaction = await Transaction_Service_1.TransactionServices.updateTransaction(id, req.body);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
    });
});
const deleteTransaction = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await Transaction_Service_1.TransactionServices.deleteTransaction(id);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction deleted successfully',
    });
});
const getTransactionsByType = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const transactions = await Transaction_Service_1.TransactionServices.getTransactionsByType(type);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transactions retrieved successfully by type',
        data: transactions,
        meta: {
            total: transactions.length,
        }
    });
});
const getTransactionsByDateRange = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate } = req.params;
    const transactions = await Transaction_Service_1.TransactionServices.getTransactionsByDateRange(startDate, endDate);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transactions retrieved successfully by date range',
        data: transactions,
        meta: {
            total: transactions.length,
        }
    });
});
exports.TransactionControllers = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByType
};
