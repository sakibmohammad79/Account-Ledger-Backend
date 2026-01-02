import { Router } from "express";
import { TransactionControllers } from "./Transaction.controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createTransactionSchema, getTransactionByIdSchema, getTransactionsByDateRangeSchema, getTransactionsByTypeSchema, updateTransactionSchema } from "./Transaction.Validation";

const router = Router();


// Get all transactions
router.get('/', TransactionControllers.getAllTransactions);

// Get transaction by ID
router.get('/:id', validateRequest(getTransactionByIdSchema), TransactionControllers.getTransactionById);

// Create new transaction
router.post('/', validateRequest(createTransactionSchema),  TransactionControllers.createTransaction);

// Update transaction
router.patch('/:id', validateRequest(updateTransactionSchema), TransactionControllers.updateTransaction);

// Delete transaction
router.delete('/:id', TransactionControllers.deleteTransaction);

// Get transactions by type
router.get('/type/:type', validateRequest(getTransactionsByTypeSchema), TransactionControllers.getTransactionsByType);

// Get transactions by date range
router.get('/date-range/:startDate/:endDate', validateRequest(getTransactionsByDateRangeSchema), TransactionControllers.getTransactionsByDateRange);

export const TransactionRoutes = router;