"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountsByTypeSchema = exports.getAccountByIdSchema = exports.updateAccountSchema = exports.createAccountSchema = exports.TransactionTypeEnum = exports.AccountCategoryEnum = exports.AccountTypeEnum = void 0;
const zod_1 = require("zod");
// ==================== ENUMS ====================
exports.AccountTypeEnum = zod_1.z.enum([
    'ASSET',
    'LIABILITY',
    'EQUITY',
    'REVENUE',
    'EXPENSE'
]);
exports.AccountCategoryEnum = zod_1.z.enum([
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
exports.TransactionTypeEnum = zod_1.z.enum([
    'SALES',
    'PURCHASE',
    'RECEIPT',
    'PAYMENT',
    'GENERAL'
]);
exports.createAccountSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z
            .string()
            .min(2, 'Account code must be at least 2 characters')
            .max(20, 'Account code must not exceed 20 characters')
            .regex(/^[A-Z0-9-]+$/, 'Account code must contain only uppercase letters, numbers, and hyphens'),
        name: zod_1.z
            .string()
            .min(3, 'Account name must be at least 3 characters')
            .max(100, 'Account name must not exceed 100 characters')
            .trim(),
        type: exports.AccountTypeEnum,
        category: exports.AccountCategoryEnum,
        description: zod_1.z
            .string()
            .max(500, 'Description must not exceed 500 characters')
            .optional(),
        isActive: zod_1.z.boolean().optional().default(true)
    })
});
exports.updateAccountSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid account ID format')
    }),
    body: zod_1.z.object({
        code: zod_1.z
            .string()
            .min(2, 'Account code must be at least 2 characters')
            .max(20, 'Account code must not exceed 20 characters')
            .regex(/^[A-Z0-9-]+$/, 'Account code must contain only uppercase letters, numbers, and hyphens')
            .optional(),
        name: zod_1.z
            .string()
            .min(3, 'Account name must be at least 3 characters')
            .max(100, 'Account name must not exceed 100 characters')
            .trim()
            .optional(),
        type: exports.AccountTypeEnum.optional(),
        category: exports.AccountCategoryEnum.optional(),
        description: zod_1.z
            .string()
            .max(500, 'Description must not exceed 500 characters')
            .optional(),
        isActive: zod_1.z.boolean().optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
exports.getAccountByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid account ID format')
    })
});
exports.getAccountsByTypeSchema = zod_1.z.object({
    params: zod_1.z.object({
        type: exports.AccountTypeEnum
    })
});
