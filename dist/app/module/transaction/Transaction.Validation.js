"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsQuerySchema = exports.getTransactionsByDateRangeSchema = exports.getTransactionsByTypeSchema = exports.getTransactionByIdSchema = exports.updateTransactionSchema = exports.createTransactionSchema = exports.entrySchema = void 0;
const zod_1 = require("zod");
const Account_Validation_1 = require("../account/Account.Validation");
// ==================== TRANSACTION ENTRY SCHEMAS ====================
exports.entrySchema = zod_1.z.object({
    accountId: zod_1.z.string().uuid('Invalid account ID format'),
    debit: zod_1.z
        .number()
        .min(0, 'Debit must be non-negative')
        .max(999999999.99, 'Debit amount too large')
        .multipleOf(0.01, 'Debit must have at most 2 decimal places')
        .default(0),
    credit: zod_1.z
        .number()
        .min(0, 'Credit must be non-negative')
        .max(999999999.99, 'Credit amount too large')
        .multipleOf(0.01, 'Credit must have at most 2 decimal places')
        .default(0),
    description: zod_1.z
        .string()
        .max(500, 'Entry description must not exceed 500 characters')
        .optional()
}).refine(data => !(data.debit > 0 && data.credit > 0), {
    message: 'An entry cannot have both debit and credit amounts'
}).refine(data => data.debit > 0 || data.credit > 0, {
    message: 'An entry must have either a debit or credit amount'
});
// ==================== TRANSACTION SCHEMAS ====================
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: Account_Validation_1.TransactionTypeEnum,
        date: zod_1.z
            .string()
            .datetime('Invalid date format. Use ISO 8601 format')
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'))
            .transform(val => new Date(val)),
        description: zod_1.z
            .string()
            .min(3, 'Description must be at least 3 characters')
            .max(500, 'Description must not exceed 500 characters')
            .trim(),
        reference: zod_1.z
            .string()
            .max(100, 'Reference must not exceed 100 characters')
            .optional(),
        notes: zod_1.z
            .string()
            .max(1000, 'Notes must not exceed 1000 characters')
            .optional(),
        entries: zod_1.z
            .array(exports.entrySchema)
            .min(2, 'At least 2 entries are required for double-entry bookkeeping')
            .max(50, 'Maximum 50 entries allowed per transaction')
    }).refine(data => {
        const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
        const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
        return Math.abs(totalDebit - totalCredit) < 0.01;
    }, {
        message: 'Total debits must equal total credits in double-entry bookkeeping',
        path: ['entries']
    })
});
exports.updateTransactionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid transaction ID format')
    }),
    body: zod_1.z.object({
        type: Account_Validation_1.TransactionTypeEnum.optional(),
        date: zod_1.z
            .string()
            .datetime('Invalid date format. Use ISO 8601 format')
            .or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'))
            .transform(val => new Date(val))
            .optional(),
        description: zod_1.z
            .string()
            .min(3, 'Description must be at least 3 characters')
            .max(500, 'Description must not exceed 500 characters')
            .trim()
            .optional(),
        reference: zod_1.z
            .string()
            .max(100, 'Reference must not exceed 100 characters')
            .optional(),
        notes: zod_1.z
            .string()
            .max(1000, 'Notes must not exceed 1000 characters')
            .optional(),
        entries: zod_1.z
            .array(exports.entrySchema)
            .min(2, 'At least 2 entries are required for double-entry bookkeeping')
            .max(50, 'Maximum 50 entries allowed per transaction')
            .optional()
    }).refine(data => {
        if (data.entries) {
            const totalDebit = data.entries.reduce((sum, entry) => sum + entry.debit, 0);
            const totalCredit = data.entries.reduce((sum, entry) => sum + entry.credit, 0);
            return Math.abs(totalDebit - totalCredit) < 0.01;
        }
        return true;
    }, {
        message: 'Total debits must equal total credits in double-entry bookkeeping',
        path: ['entries']
    })
});
exports.getTransactionByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid transaction ID format')
    })
});
exports.getTransactionsByTypeSchema = zod_1.z.object({
    params: zod_1.z.object({
        type: Account_Validation_1.TransactionTypeEnum
    })
});
exports.getTransactionsByDateRangeSchema = zod_1.z.object({
    params: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
        endDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    })
}).refine(data => new Date(data.params.startDate) <= new Date(data.params.endDate), {
    message: 'Start date must be before or equal to end date',
    path: ['params']
});
exports.getTransactionsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .regex(/^\d+$/, 'Page must be a positive integer')
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1, 'Page must be at least 1'))
            .optional()
            .default(1),
        limit: zod_1.z
            .string()
            .regex(/^\d+$/, 'Limit must be a positive integer')
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100'))
            .optional()
            .default(10),
        type: Account_Validation_1.TransactionTypeEnum.optional(),
        startDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
            .optional(),
        endDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
            .optional()
    }).refine(data => {
        if (data.startDate && data.endDate) {
            return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
    }, {
        message: 'Start date must be before or equal to end date'
    })
});
