"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountServices = void 0;
const ApiError_1 = require("../../errors/ApiError");
const Prisma_1 = __importDefault(require("../../utils/Prisma"));
const http_status_1 = __importDefault(require("http-status"));
const createAccountIntoDB = async (data) => {
    const existingAccount = await Prisma_1.default.account.findUnique({
        where: { code: data.code }
    });
    if (existingAccount) {
        throw new ApiError_1.AppError(http_status_1.default.BAD_REQUEST, 'Account code already exists');
    }
    return await Prisma_1.default.account.create({
        data: {
            code: data.code,
            name: data.name,
            type: data.type,
            category: data.category,
            description: data.description,
        }
    });
};
const getAllAccountsFromDB = async () => {
    const accountData = await Prisma_1.default.account.findMany({
        where: {
            isActive: true,
            isDeleted: false
        },
        orderBy: [
            { type: 'asc' },
            { code: 'asc' }
        ]
    });
    return accountData;
};
const getAccountsByIdFromDB = async (id) => {
    const account = await Prisma_1.default.account.findUnique({
        where: { id, isActive: true,
            isDeleted: false },
        include: {
            entries: {
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    transaction: true
                }
            }
        }
    });
    if (!account) {
        throw new ApiError_1.AppError(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    return account;
};
const updateAccountIntoDB = async (id, data) => {
    const account = await Prisma_1.default.account.findUnique({
        where: { id,
            isDeleted: false
        }
    });
    if (!account) {
        throw new ApiError_1.AppError(http_status_1.default.NOT_FOUND, 'Account not found');
    }
    // Check if new code conflicts with existing account
    if (data.code && data.code !== account.code) {
        const existingAccount = await Prisma_1.default.account.findUnique({
            where: { code: data.code }
        });
        if (existingAccount) {
            throw new ApiError_1.AppError(http_status_1.default.BAD_REQUEST, 'Account code already exists');
        }
    }
    return await Prisma_1.default.account.update({
        where: { id },
        data: {
            code: data.code,
            name: data.name,
            type: data.type,
            category: data.category,
            description: data.description,
            isActive: data.isActive
        }
    });
};
const deleteAccountFromDB = async (id) => {
    // Check if account has any entries
    const entriesCount = await Prisma_1.default.entry.count({
        where: { accountId: id }
    });
    if (entriesCount > 0) {
        throw new ApiError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot delete account with existing transactions');
    }
    return await Prisma_1.default.account.delete({
        where: { id }
    });
};
const softDeleteAccountFromDB = async (id) => {
    // Check if account has any entries
    const entriesCount = await Prisma_1.default.entry.count({
        where: { accountId: id }
    });
    if (entriesCount > 0) {
        throw new ApiError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot delete account with existing transactions');
    }
    // Soft delete: set isActive = false, set isDeleted = true
    const updatedAccount = await Prisma_1.default.account.update({
        where: { id },
        data: { isActive: false, isDeleted: true }
    });
    return updatedAccount;
};
const getAccountByTypeFromDB = async (type) => {
    return await Prisma_1.default.account.findMany({
        where: {
            type: type.toUpperCase(),
            isActive: true
        },
        orderBy: { code: 'asc' }
    });
};
exports.AccountServices = {
    getAllAccountsFromDB,
    createAccountIntoDB,
    getAccountsByIdFromDB,
    updateAccountIntoDB,
    softDeleteAccountFromDB,
    deleteAccountFromDB,
    getAccountByTypeFromDB
};
