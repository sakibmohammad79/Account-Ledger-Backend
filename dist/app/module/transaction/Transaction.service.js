"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const ApiError_1 = require("../../errors/ApiError");
const Helper_1 = require("../../utils/Helper");
const Prisma_1 = __importDefault(require("../../utils/Prisma"));
/* =========================
   Get all transactions
========================= */
const getAllTransactions = async (options) => {
    const { page = 1, limit = 10, type, startDate, endDate } = options;
    const skip = (page - 1) * limit;
    const where = {};
    if (type)
        where.type = type.toUpperCase();
    if (startDate || endDate) {
        where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
    }
    const [transactions, total] = await Promise.all([
        Prisma_1.default.transaction.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: 'desc' },
            include: {
                entries: {
                    include: { account: true }
                }
            }
        }),
        Prisma_1.default.transaction.count({ where })
    ]);
    return {
        data: transactions,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
        }
    };
};
/* =========================
   Get transaction by ID
========================= */
const getTransactionById = async (id) => {
    const transaction = await Prisma_1.default.transaction.findUnique({
        where: { id },
        include: {
            entries: {
                include: { account: true }
            }
        }
    });
    if (!transaction) {
        throw new ApiError_1.AppError(404, 'Transaction not found');
    }
    return transaction;
};
/* =========================
   Create transaction
========================= */
const createTransaction = async (data) => {
    const { type, date, description, reference, notes, entries } = data;
    const totalDebit = entries.reduce((sum, e) => sum + parseFloat(e.debit || 0), 0);
    const totalCredit = entries.reduce((sum, e) => sum + parseFloat(e.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new ApiError_1.AppError(400, 'Total debits must equal total credits');
    }
    const accountIds = entries.map((e) => e.accountId);
    const accounts = await Prisma_1.default.account.findMany({
        where: { id: { in: accountIds } }
    });
    if (accounts.length !== accountIds.length) {
        throw new ApiError_1.AppError(404, 'One or more accounts not found');
    }
    const transactionNo = await (0, Helper_1.generateTransactionNo)(type);
    return Prisma_1.default.$transaction(async (tx) => {
        return tx.transaction.create({
            data: {
                transactionNo,
                type,
                date: new Date(date),
                description,
                reference,
                notes,
                entries: {
                    create: entries.map((e) => ({
                        accountId: e.accountId,
                        debit: parseFloat(e.debit || 0),
                        credit: parseFloat(e.credit || 0),
                        description: e.description || description
                    }))
                }
            },
            include: {
                entries: {
                    include: { account: true }
                }
            }
        });
    });
};
/* =========================
   Update transaction
========================= */
const updateTransaction = async (id, data) => {
    const { type, date, description, reference, notes, entries } = data;
    const existing = await Prisma_1.default.transaction.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError_1.AppError(404, 'Transaction not found');
    }
    const totalDebit = entries.reduce((s, e) => s + parseFloat(e.debit || 0), 0);
    const totalCredit = entries.reduce((s, e) => s + parseFloat(e.credit || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new ApiError_1.AppError(400, 'Total debits must equal total credits');
    }
    return Prisma_1.default.$transaction(async (tx) => {
        await tx.entry.deleteMany({
            where: { transactionId: id }
        });
        return tx.transaction.update({
            where: { id },
            data: {
                type,
                date: new Date(date),
                description,
                reference,
                notes,
                entries: {
                    create: entries.map((e) => ({
                        accountId: e.accountId,
                        debit: parseFloat(e.debit || 0),
                        credit: parseFloat(e.credit || 0),
                        description: e.description || description
                    }))
                }
            },
            include: {
                entries: {
                    include: { account: true }
                }
            }
        });
    });
};
/* =========================
   Delete transaction
========================= */
const deleteTransaction = async (id) => {
    const transaction = await Prisma_1.default.transaction.findUnique({ where: { id } });
    if (!transaction) {
        throw new ApiError_1.AppError(404, 'Transaction not found');
    }
    return Prisma_1.default.transaction.delete({
        where: { id }
    });
};
/* =========================
   Get by type
========================= */
const getTransactionsByType = async (type) => {
    return Prisma_1.default.transaction.findMany({
        where: { type: type.toUpperCase() },
        orderBy: { date: 'desc' },
        include: {
            entries: {
                include: { account: true }
            }
        }
    });
};
/* =========================
   Get by date range
========================= */
const getTransactionsByDateRange = async (startDate, endDate) => {
    return Prisma_1.default.transaction.findMany({
        where: {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        },
        orderBy: { date: 'desc' },
        include: {
            entries: {
                include: { account: true }
            }
        }
    });
};
/* =========================
   Exports
========================= */
exports.TransactionServices = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByDateRange
};
