import {z} from 'zod'
import { TransactionTypeEnum } from '../account/Account.Validation';
// ==================== TRANSACTION ENTRY SCHEMAS ====================

export const entrySchema = z.object({
  accountId: z.string().uuid('Invalid account ID format'),
  
  debit: z
    .number()
    .min(0, 'Debit must be non-negative')
    .max(999999999.99, 'Debit amount too large')
    .multipleOf(0.01, 'Debit must have at most 2 decimal places')
    .default(0),
  
  credit: z
    .number()
    .min(0, 'Credit must be non-negative')
    .max(999999999.99, 'Credit amount too large')
    .multipleOf(0.01, 'Credit must have at most 2 decimal places')
    .default(0),
  
  description: z
    .string()
    .max(500, 'Entry description must not exceed 500 characters')
    .optional()
}).refine(
  data => !(data.debit > 0 && data.credit > 0),
  {
    message: 'An entry cannot have both debit and credit amounts'
  }
).refine(
  data => data.debit > 0 || data.credit > 0,
  {
    message: 'An entry must have either a debit or credit amount'
  }
);

// ==================== TRANSACTION SCHEMAS ====================

export const createTransactionSchema = z.object({
  body: z.object({
    type: TransactionTypeEnum,
    
    date: z
      .string()
      .datetime('Invalid date format. Use ISO 8601 format')
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'))
      .transform(val => new Date(val)),
    
    description: z
      .string()
      .min(3, 'Description must be at least 3 characters')
      .max(500, 'Description must not exceed 500 characters')
      .trim(),
    
    reference: z
      .string()
      .max(100, 'Reference must not exceed 100 characters')
      .optional(),
    
    notes: z
      .string()
      .max(1000, 'Notes must not exceed 1000 characters')
      .optional(),
    
    entries: z
      .array(entrySchema)
      .min(2, 'At least 2 entries are required for double-entry bookkeeping')
      .max(50, 'Maximum 50 entries allowed per transaction')
  }).refine(
    data => {
      const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
      const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
      return Math.abs(totalDebit - totalCredit) < 0.01;
    },
    {
      message: 'Total debits must equal total credits in double-entry bookkeeping',
      path: ['entries']
    }
  )
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID format')
  }),
  body: z.object({
    type: TransactionTypeEnum.optional(),
    
    date: z
      .string()
      .datetime('Invalid date format. Use ISO 8601 format')
      .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'))
      .transform(val => new Date(val))
      .optional(),
    
    description: z
      .string()
      .min(3, 'Description must be at least 3 characters')
      .max(500, 'Description must not exceed 500 characters')
      .trim()
      .optional(),
    
    reference: z
      .string()
      .max(100, 'Reference must not exceed 100 characters')
      .optional(),
    
    notes: z
      .string()
      .max(1000, 'Notes must not exceed 1000 characters')
      .optional(),
    
    entries: z
      .array(entrySchema)
      .min(2, 'At least 2 entries are required for double-entry bookkeeping')
      .max(50, 'Maximum 50 entries allowed per transaction')
      .optional()
  }).refine(
    data => {
      if (data.entries) {
        const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
        return Math.abs(totalDebit - totalCredit) < 0.01;
      }
      return true;
    },
    {
      message: 'Total debits must equal total credits in double-entry bookkeeping',
      path: ['entries']
    }
  )
});

export const getTransactionByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid transaction ID format')
  })
});

export const getTransactionsByTypeSchema = z.object({
  params: z.object({
    type: TransactionTypeEnum
  })
});

export const getTransactionsByDateRangeSchema = z.object({
  params: z.object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
    
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
  })
}).refine(
  data => new Date(data.params.startDate) <= new Date(data.params.endDate),
  {
    message: 'Start date must be before or equal to end date',
    path: ['params']
  }
);

export const getTransactionsQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive integer')
      .transform(Number)
      .pipe(z.number().int().min(1, 'Page must be at least 1'))
      .optional()
      .default(1),
    
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive integer')
      .transform(Number)
      .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100'))
      .optional()
      .default(10),
    
    type: TransactionTypeEnum.optional(),
    
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional()
  }).refine(
    data => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: 'Start date must be before or equal to end date'
    }
  )
});