"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.formatCurrency = exports.generateTransactionNo = void 0;
const Prisma_1 = __importDefault(require("./Prisma"));
// Generate unique transaction number
const generateTransactionNo = async (type) => {
    const prefix = {
        SALES: 'SL',
        PURCHASE: 'PC',
        RECEIPT: 'RC',
        PAYMENT: 'PM',
        GENERAL: 'GN'
    }[type] || 'TX';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // Get count of transactions for this type this month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    const count = await Prisma_1.default.transaction.count({
        where: {
            type: type,
            date: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `${prefix}${year}${month}${sequence}`;
};
exports.generateTransactionNo = generateTransactionNo;
// Format currency
const formatCurrency = (amount, currency = 'BDT') => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: currency
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
// Format date
const formatDate = (date, // safer typing
format = 'short') => {
    // Decide formatting options
    const options = format === 'short'
        ? { year: 'numeric', month: '2-digit', day: '2-digit' } // 01/01/2026
        : { year: 'numeric', month: 'long', day: 'numeric' }; // January 1, 2026
    // Ensure date is valid
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
    }
    // Format date
    return new Intl.DateTimeFormat('en-BD', options).format(d);
};
exports.formatDate = formatDate;
