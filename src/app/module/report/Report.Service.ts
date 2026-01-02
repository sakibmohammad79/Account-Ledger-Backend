import prisma from "../../utils/Prisma";

// Helper to safely parse number
const toNumber = (value: any): number => Number(value || 0);

/* =========================
   Journal Report
========================= */
export const getJournalReport = async (options: {
  startDate?: string | Date;
  endDate?: string | Date;
  page?: number;
  limit?: number;
} = {}) => {
  const { startDate, endDate, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "asc" },
      include: { entries: { include: { account: true } } },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: transactions,
    pagination: { total, page, pages: Math.ceil(total / limit), limit },
  };
};

/* =========================
   Balance Sheet
========================= */
export const getBalanceSheet = async (asOfDate?: string | Date) => {
  const date = asOfDate ? new Date(asOfDate) : new Date();

  const entries = await prisma.entry.findMany({
    where: { transaction: { date: { lte: date } } },
    include: { account: true },
  });

  const accountBalances: Record<string, { account: any; debit: number; credit: number; balance: number }> = {};

  entries.forEach((entry) => {
    const account = entry.account;
    if (!account) return;
    const id = account.id;

    if (!accountBalances[id]) accountBalances[id] = { account, debit: 0, credit: 0, balance: 0 };

    accountBalances[id].debit += toNumber(entry.debit);
    accountBalances[id].credit += toNumber(entry.credit);
  });

  const assets: any[] = [];
  const liabilities: any[] = [];
  const equity: any[] = [];

  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;

  Object.values(accountBalances).forEach((item) => {
    const { account, debit, credit } = item;
    let balance = 0;

    if (account.type === "ASSET" || account.type === "EXPENSE") balance = debit - credit;
    else balance = credit - debit;

    if (balance === 0) return;

    item.balance = balance;

    if (account.type === "ASSET") {
      assets.push({ ...account, balance });
      totalAssets += balance;
    } else if (account.type === "LIABILITY") {
      liabilities.push({ ...account, balance });
      totalLiabilities += balance;
    } else if (account.type === "EQUITY") {
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
export const getIncomeStatement = async (startDate?: string | Date, endDate?: string | Date) => {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), 0, 1);
  const end = endDate ? new Date(endDate) : new Date();

  const entries = await prisma.entry.findMany({
    where: { transaction: { date: { gte: start, lte: end } } },
    include: { account: true },
  });

  const accountBalances: Record<string, { account: any; debit: number; credit: number }> = {};

  entries.forEach((entry) => {
    const account = entry.account;
    if (!account) return;
    const id = account.id;

    if (!accountBalances[id]) accountBalances[id] = { account, debit: 0, credit: 0 };

    accountBalances[id].debit += toNumber(entry.debit);
    accountBalances[id].credit += toNumber(entry.credit);
  });

  const revenues: any[] = [];
  const expenses: any[] = [];
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
    } else if (account.type === "EXPENSE") {
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
export const getTrialBalance = async (asOfDate?: string | Date) => {
  const date = asOfDate ? new Date(asOfDate) : new Date();

  const entries = await prisma.entry.findMany({
    where: { transaction: { date: { lte: date } } },
    include: { account: true },
  });

  const accountBalances: Record<string, { account: any; debit: number; credit: number }> = {};
  entries.forEach((entry) => {
    const account = entry.account;
    if (!account) return;
    const id = account.id;

    if (!accountBalances[id]) accountBalances[id] = { account, debit: 0, credit: 0 };
    accountBalances[id].debit += toNumber(entry.debit);
    accountBalances[id].credit += toNumber(entry.credit);
  });

  const accounts: any[] = [];
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
export const getAccountLedger = async (options: {
  accountId: string;
  startDate?: string | Date;
  endDate?: string | Date;
  page?: number;
  limit?: number;
}) => {
  const { accountId, startDate, endDate, page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const where: any = { accountId };
  if (startDate || endDate) {
    where.transaction = { date: {} };
    if (startDate) where.transaction.date.gte = new Date(startDate);
    if (endDate) where.transaction.date.lte = new Date(endDate);
  }

  const [entries, total, account] = await Promise.all([
    prisma.entry.findMany({ where, skip, take: limit, orderBy: { transaction: { date: "asc" } }, include: { transaction: true } }),
    prisma.entry.count({ where }),
    prisma.account.findUnique({ where: { id: accountId } }),
  ]);

  if (!account) throw new Error("Account not found");

  let runningBalance = 0;
  const entriesWithBalance = entries.map((entry) => {
    if (account.type === "ASSET" || account.type === "EXPENSE") {
      runningBalance += toNumber(entry.debit) - toNumber(entry.credit);
    } else {
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
