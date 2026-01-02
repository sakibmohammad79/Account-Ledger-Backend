"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportServices = void 0;
const Prisma_1 = __importDefault(require("../../utils/Prisma"));
// Helper to safely parse number
const toNumber = (value) => Number(value || 0);
/* =========================
   Journal Report
========================= */
const getJournalReport = async (options = {}) => {
    const { startDate, endDate, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const where = {};
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
            orderBy: { date: "asc" },
            include: { entries: { include: { account: true } } },
        }),
        Prisma_1.default.transaction.count({ where }),
    ]);
    return {
        data: transactions,
        pagination: { total, page, pages: Math.ceil(total / limit), limit },
    };
};
/* =========================
   Balance Sheet
========================= */
const getBalanceSheet = async (asOfDate) => {
    const date = asOfDate ? new Date(asOfDate) : new Date();
    const entries = await Prisma_1.default.entry.findMany({
        where: { transaction: { date: { lte: date } } },
        include: { account: true },
    });
    const accountBalances = {};
    entries.forEach((entry) => {
        const account = entry.account;
        if (!account)
            return;
        const id = account.id;
        if (!accountBalances[id])
            accountBalances[id] = { account, debit: 0, credit: 0, balance: 0 };
        accountBalances[id].debit += toNumber(entry.debit);
        accountBalances[id].credit += toNumber(entry.credit);
    });
    const assets = [];
    const liabilities = [];
    const equity = [];
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    Object.values(accountBalances).forEach((item) => {
        const { account, debit, credit } = item;
        let balance = 0;
        if (account.type === "ASSET" || account.type === "EXPENSE")
            balance = debit - credit;
        else
            balance = credit - debit;
        if (balance === 0)
            return;
        item.balance = balance;
        if (account.type === "ASSET") {
            assets.push({ ...account, balance });
            totalAssets += balance;
        }
        else if (account.type === "LIABILITY") {
            liabilities.push({ ...account, balance });
            totalLiabilities += balance;
        }
        else if (account.type === "EQUITY") {
            equity.push({ ...account, balance });
            totalEquity += balance;
        }
    });
    return {
        asOfDate: date,
        assets: { accounts: assets, total: totalAssets },
        liabilities: { accounts: liabilities, total: totalLiabilities },
        equity: { accounts: equity, total: totalEquity },
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
        isBalanced: totalAssets === totalLiabilities + totalEquity,
    };
};
/* =========================
   Income Statement
========================= */
const getIncomeStatement = async (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();
    const entries = await Prisma_1.default.entry.findMany({
        where: { transaction: { date: { gte: start, lte: end } } },
        include: { account: true },
    });
    const accountBalances = {};
    entries.forEach((entry) => {
        const account = entry.account;
        if (!account)
            return;
        const id = account.id;
        if (!accountBalances[id])
            accountBalances[id] = { account, debit: 0, credit: 0 };
        accountBalances[id].debit += toNumber(entry.debit);
        accountBalances[id].credit += toNumber(entry.credit);
    });
    const revenues = [];
    const expenses = [];
    let totalRevenue = 0;
    let totalExpense = 0;
    Object.values(accountBalances).forEach((item) => {
        const { account, debit, credit } = item;
        if (account.type === "REVENUE") {
            const balance = credit - debit;
            if (balance !== 0) {
                revenues.push({ ...account, amount: balance });
                totalRevenue += balance;
            }
        }
        else if (account.type === "EXPENSE") {
            const balance = debit - credit;
            if (balance !== 0) {
                expenses.push({ ...account, amount: balance });
                totalExpense += balance;
            }
        }
    });
    return {
        period: { startDate: start, endDate: end },
        revenue: { accounts: revenues, total: totalRevenue },
        expenses: { accounts: expenses, total: totalExpense },
        netIncome: totalRevenue - totalExpense,
        isProfitable: totalRevenue - totalExpense > 0,
    };
};
/* =========================
   Trial Balance
========================= */
const getTrialBalance = async (asOfDate) => {
    const date = asOfDate ? new Date(asOfDate) : new Date();
    const entries = await Prisma_1.default.entry.findMany({
        where: { transaction: { date: { lte: date } } },
        include: { account: true },
    });
    const accountBalances = {};
    entries.forEach((entry) => {
        const account = entry.account;
        if (!account)
            return;
        const id = account.id;
        if (!accountBalances[id])
            accountBalances[id] = { account, debit: 0, credit: 0 };
        accountBalances[id].debit += toNumber(entry.debit);
        accountBalances[id].credit += toNumber(entry.credit);
    });
    const accounts = [];
    let totalDebit = 0;
    let totalCredit = 0;
    Object.values(accountBalances).forEach((item) => {
        const { account, debit, credit } = item;
        if (debit !== 0 || credit !== 0) {
            accounts.push({ ...account, debit, credit });
            totalDebit += debit;
            totalCredit += credit;
        }
    });
    return {
        asOfDate: date,
        accounts,
        totals: { debit: totalDebit, credit: totalCredit },
        isBalanced: totalDebit === totalCredit,
    };
};
/* =========================
   Account Ledger
========================= */
const getAccountLedger = async (options) => {
    const { accountId, startDate, endDate, page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    const where = { accountId };
    if (startDate || endDate) {
        where.transaction = { date: {} };
        if (startDate)
            where.transaction.date.gte = new Date(startDate);
        if (endDate)
            where.transaction.date.lte = new Date(endDate);
    }
    const [entries, total, account] = await Promise.all([
        Prisma_1.default.entry.findMany({ where, skip, take: limit, orderBy: { transaction: { date: "asc" } }, include: { transaction: true } }),
        Prisma_1.default.entry.count({ where }),
        Prisma_1.default.account.findUnique({ where: { id: accountId } }),
    ]);
    if (!account)
        throw new Error("Account not found");
    let runningBalance = 0;
    const entriesWithBalance = entries.map((entry) => {
        if (account.type === "ASSET" || account.type === "EXPENSE") {
            runningBalance += toNumber(entry.debit) - toNumber(entry.credit);
        }
        else {
            runningBalance += toNumber(entry.credit) - toNumber(entry.debit);
        }
        return { ...entry, balance: runningBalance };
    });
    return {
        account,
        data: entriesWithBalance,
        pagination: { total, page, pages: Math.ceil(total / limit), limit },
    };
};
exports.ReportServices = {
    getJournalReport,
    getBalanceSheet,
    getIncomeStatement,
    getTrialBalance,
    getAccountLedger,
};
