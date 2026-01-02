import prisma from "./Prisma";
import { TransactionType } from "@prisma/client";

// Generate unique transaction number
export const generateTransactionNo = async (type: TransactionType) => {
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

  const count = await prisma.transaction.count({
    where: {
      type: type as TransactionType,
      date: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  });

  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `${prefix}${year}${month}${sequence}`;
};

// Format currency
export const formatCurrency = (amount: number, currency = 'BDT') => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
export const formatDate = (
  date: string | number | Date,  // safer typing
  format: 'short' | 'long' = 'short'
): string => {
  // Decide formatting options
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { year: 'numeric', month: '2-digit', day: '2-digit' } // 01/01/2026
      : { year: 'numeric', month: 'long', day: 'numeric' };   // January 1, 2026

  // Ensure date is valid
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date');
  }

  // Format date
  return new Intl.DateTimeFormat('en-BD', options).format(d);
};

