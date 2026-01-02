"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = require("express");
const Transaction_controller_1 = require("./Transaction.controller");
const ValidateRequest_1 = require("../../middlewares/ValidateRequest");
const Transaction_Validation_1 = require("./Transaction.Validation");
const router = (0, express_1.Router)();
// Get all transactions
router.get('/', Transaction_controller_1.TransactionControllers.getAllTransactions);
// Get transaction by ID
router.get('/:id', (0, ValidateRequest_1.validateRequest)(Transaction_Validation_1.getTransactionByIdSchema), Transaction_controller_1.TransactionControllers.getTransactionById);
// Create new transaction
router.post('/', (0, ValidateRequest_1.validateRequest)(Transaction_Validation_1.createTransactionSchema), Transaction_controller_1.TransactionControllers.createTransaction);
// Update transaction
router.patch('/:id', (0, ValidateRequest_1.validateRequest)(Transaction_Validation_1.updateTransactionSchema), Transaction_controller_1.TransactionControllers.updateTransaction);
// Delete transaction
router.delete('/:id', Transaction_controller_1.TransactionControllers.deleteTransaction);
// Get transactions by type
router.get('/type/:type', (0, ValidateRequest_1.validateRequest)(Transaction_Validation_1.getTransactionsByTypeSchema), Transaction_controller_1.TransactionControllers.getTransactionsByType);
// Get transactions by date range
router.get('/date-range/:startDate/:endDate', (0, ValidateRequest_1.validateRequest)(Transaction_Validation_1.getTransactionsByDateRangeSchema), Transaction_controller_1.TransactionControllers.getTransactionsByDateRange);
exports.TransactionRoutes = router;
