import { z } from 'zod';

// ==================== ENUMS ====================

export const AccountTypeEnum = z.enum([
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE'
]);

export const AccountCategoryEnum = z.enum([
  'CURRENT_ASSET',
  'FIXED_ASSET',
  'CURRENT_LIABILITY',
  'LONG_TERM_LIABILITY',
  'OWNER_EQUITY',
  'RETAINED_EARNINGS',
  'OPERATING_REVENUE',
  'NON_OPERATING_REVENUE',
  'OPERATING_EXPENSE',
  'NON_OPERATING_EXPENSE'
]);

export const TransactionTypeEnum = z.enum([
  'SALES',
  'PURCHASE',
  'RECEIPT',
  'PAYMENT',
  'GENERAL'
]);

export const createAccountSchema = z.object({
  body: z.object({
    code: z
      .string()
      .min(2, 'Account code must be at least 2 characters')
      .max(20, 'Account code must not exceed 20 characters')
      .regex(/^[A-Z0-9-]+$/, 'Account code must contain only uppercase letters, numbers, and hyphens'),
    
    name: z
      .string()
      .min(3, 'Account name must be at least 3 characters')
      .max(100, 'Account name must not exceed 100 characters')
      .trim(),
    
    type: AccountTypeEnum,
    
    category: AccountCategoryEnum,
    
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .optional(),
    
    isActive: z.boolean().optional().default(true)
  })
});

export const updateAccountSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account ID format')
  }),
  body: z.object({
    code: z
      .string()
      .min(2, 'Account code must be at least 2 characters')
      .max(20, 'Account code must not exceed 20 characters')
      .regex(/^[A-Z0-9-]+$/, 'Account code must contain only uppercase letters, numbers, and hyphens')
      .optional(),
    
    name: z
      .string()
      .min(3, 'Account name must be at least 3 characters')
      .max(100, 'Account name must not exceed 100 characters')
      .trim()
      .optional(),
    
    type: AccountTypeEnum.optional(),
    
    category: AccountCategoryEnum.optional(),
    
    description: z
      .string()
      .max(500, 'Description must not exceed 500 characters')
      .optional(),
    
    isActive: z.boolean().optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

export const getAccountByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid account ID format')
  })
});

export const getAccountsByTypeSchema = z.object({
  params: z.object({
    type: AccountTypeEnum
  })
});

