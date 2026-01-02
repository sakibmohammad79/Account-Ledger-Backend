"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountLedgerSchema = exports.trialBalanceQuerySchema = exports.incomeStatementQuerySchema = exports.balanceSheetQuerySchema = exports.journalReportQuerySchema = void 0;
const zod_1 = require("zod");
// ==================== REPORT SCHEMAS ====================
exports.journalReportQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
            .optional(),
        endDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
            .optional(),
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
            .default(50)
    }).refine(data => {
        if (data.startDate && data.endDate) {
            return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
    }, {
        message: 'Start date must be before or equal to end date'
    })
});
exports.balanceSheetQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        asOfDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
            .optional()
    })
});
exports.incomeStatementQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
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
exports.trialBalanceQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        asOfDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
            .optional()
    })
});
exports.accountLedgerSchema = zod_1.z.object({
    params: zod_1.z.object({
        accountId: zod_1.z.string().uuid('Invalid account ID format')
    }),
    query: zod_1.z.object({
        startDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
            .optional(),
        endDate: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
            .optional(),
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
            .default(50)
    }).refine(data => {
        if (data.startDate && data.endDate) {
            return new Date(data.startDate) <= new Date(data.endDate);
        }
        return true;
    }, {
        message: 'Start date must be before or equal to end date'
    })
});
