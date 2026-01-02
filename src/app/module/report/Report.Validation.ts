import {z} from 'zod';

// ==================== REPORT SCHEMAS ====================
export const journalReportQuerySchema = z.object({
  query: z.object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional(),
    
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
      .default(50)
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

export const balanceSheetQuerySchema = z.object({
  query: z.object({
    asOfDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional()
  })
});

export const incomeStatementQuerySchema = z.object({
  query: z.object({
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

export const trialBalanceQuerySchema = z.object({
  query: z.object({
    asOfDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .optional()
  })
});

export const accountLedgerSchema = z.object({
  params: z.object({
    accountId: z.string().uuid('Invalid account ID format')
  }),
  query: z.object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
      .optional(),
    
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
      .optional(),
    
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
      .default(50)
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