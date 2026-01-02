import { AppError } from "../../errors/ApiError";
import { generateTransactionNo } from "../../utils/Helper";
import prisma from "../../utils/Prisma";


/* =========================
   Get all transactions
========================= */
const getAllTransactions = async (options: any) => {
  const { page = 1, limit = 10, type, startDate, endDate } = options;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (type) where.type = type.toUpperCase();

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
      orderBy: { date: 'desc' },
      include: {
        entries: {
          include: { account: true }
        }
      }
    }),
    prisma.transaction.count({ where })
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
const getTransactionById = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      entries: {
        include: { account: true }
      }
    }
  });

  if (!transaction) {
    throw new AppError(404, 'Transaction not found',);
  }

  return transaction;
};

/* =========================
   Create transaction
========================= */
const createTransaction = async (data: any) => {
  const { type, date, description, reference, notes, entries } = data;

  const totalDebit = entries.reduce(
    (sum: number, e: any) => sum + parseFloat(e.debit || 0),
    0
  );
  const totalCredit = entries.reduce(
    (sum: number, e: any) => sum + parseFloat(e.credit || 0),
    0
  );

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new AppError(400, 'Total debits must equal total credits',);
  }

  const accountIds = entries.map((e: any) => e.accountId);
  const accounts = await prisma.account.findMany({
    where: { id: { in: accountIds } }
  });

  if (accounts.length !== accountIds.length) {
    throw new AppError( 404, 'One or more accounts not found');
  }

  const transactionNo = await generateTransactionNo(type);

  return prisma.$transaction(async (tx: any) => {
    return tx.transaction.create({
      data: {
        transactionNo,
        type,
        date: new Date(date),
        description,
        reference,
        notes,
        entries: {
          create: entries.map((e: any) => ({
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
const updateTransaction = async (id: string, data: any) => {
  const { type, date, description, reference, notes, entries } = data;

  const existing = await prisma.transaction.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, 'Transaction not found',);
  }

  const totalDebit = entries.reduce((s: number, e: any) => s + parseFloat(e.debit || 0), 0);
  const totalCredit = entries.reduce((s: number, e: any) => s + parseFloat(e.credit || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new AppError(400, 'Total debits must equal total credits');
  }

  return prisma.$transaction(async (tx: any) => {
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
          create: entries.map((e: any) => ({
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
const deleteTransaction = async (id: string) => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction) {
    throw new AppError(404, 'Transaction not found',);
  }

  return prisma.transaction.delete({
    where: { id }
  });
};

/* =========================
   Get by type
========================= */
const getTransactionsByType = async (type: string) => {
  return prisma.transaction.findMany({
    where: { type: type.toUpperCase() as any },
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
const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
  return prisma.transaction.findMany({
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
export const TransactionServices = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByType,
  getTransactionsByDateRange
};
