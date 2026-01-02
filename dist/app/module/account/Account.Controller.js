"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const CatchAsync_1 = require("../../utils/CatchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const Account_Service_1 = require("./Account.Service");
const getAllAccounts = (0, CatchAsync_1.catchAsync)(async (_req, res) => {
    const accounts = await Account_Service_1.AccountServices.getAllAccountsFromDB();
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Accounts retrieved successfully',
        data: accounts,
        meta: {
            total: accounts.length,
        }
    });
});
const getAccountById = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const account = await Account_Service_1.AccountServices.getAccountsByIdFromDB(id);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account retrieved successfully',
        data: account,
    });
});
const createAccount = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const account = await Account_Service_1.AccountServices.createAccountIntoDB(req.body);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Account created successfully',
        data: account,
    });
});
const updateAccount = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const account = await Account_Service_1.AccountServices.updateAccountIntoDB(id, req.body);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account updated successfully',
        data: account,
    });
});
const deleteAccount = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const account = await Account_Service_1.AccountServices.deleteAccountFromDB(id); // hard delete
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account deleted successfully',
        data: account,
    });
});
const softDeleteAccount = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const account = await Account_Service_1.AccountServices.softDeleteAccountFromDB(id); // soft delete
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Account deactivated successfully',
        data: account,
    });
});
const getAccountsByType = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { type } = req.params;
    const accounts = await Account_Service_1.AccountServices.getAccountByTypeFromDB(type);
    (0, SendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Accounts retrieved successfully by type',
        data: accounts,
        meta: {
            total: accounts.length
        }
    });
});
exports.AccountControllers = {
    createAccount,
    getAllAccounts,
    getAccountById,
    getAccountsByType,
    updateAccount,
    deleteAccount,
    softDeleteAccount
};
