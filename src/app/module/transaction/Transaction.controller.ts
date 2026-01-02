import { Request, Response } from 'express';
import status from 'http-status';

import { sendResponse } from '../../utils/SendResponse';
import { catchAsync } from '../../utils/CatchAsync';
import { TransactionServices } from './Transaction.Service';

 const createTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const transaction = await TransactionServices.createTransaction(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    });
  }
);

 const getAllTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const {
      page = '1',
      limit = '10',
      type,
      startDate,
      endDate,
    } = req.query;

    const result = await TransactionServices.getAllTransactions({
      page: Number(page),
      limit: Number(limit),
      type: type as string | undefined,
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
    });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transactions retrieved successfully',
      data: result.data,
      meta: {
        total : result.pagination.total,
      }
    });
  }
);


 const getTransactionById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await TransactionServices.getTransactionById(id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  }
);


 const updateTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await TransactionServices.updateTransaction(id, req.body);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  }
);


 const deleteTransaction = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await TransactionServices.deleteTransaction(id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transaction deleted successfully',
    });
  }
);


 const getTransactionsByType = catchAsync(
  async (req: Request, res: Response) => {
    const { type } = req.params;
    const transactions = await TransactionServices.getTransactionsByType(type);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transactions retrieved successfully by type',
      data: transactions,
      meta: {
        total :transactions.length,
      }
    });
  }
);

 const getTransactionsByDateRange = catchAsync(
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.params;
    const transactions =
      await TransactionServices.getTransactionsByDateRange(startDate, endDate);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: 'Transactions retrieved successfully by date range',
      data: transactions,
      meta: {
        total :transactions.length,
      }
    });
  }
);


export const TransactionControllers = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDateRange,
    getTransactionsByType
}
