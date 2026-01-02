import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../utils/CatchAsync';
import { sendResponse } from '../../utils/SendResponse';
import { AccountServices } from './Account.Service';

const getAllAccounts = catchAsync(async (_req: Request, res: Response) => {
  const accounts = await AccountServices.getAllAccountsFromDB();
  
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Accounts retrieved successfully',
    data: accounts,
    meta: {
      total: accounts.length,
    }
  });
});


 const getAccountById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountServices.getAccountsByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Account retrieved successfully',
    data: account,
  });
});


 const createAccount = catchAsync(async (req: Request, res: Response) => {
  const account = await AccountServices.createAccountIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Account created successfully',
    data: account,
  });
});


 const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountServices.updateAccountIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Account updated successfully',
    data: account,
  });
});


 const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountServices.deleteAccountFromDB(id); // hard delete

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Account deleted successfully',
    data: account,
  });
});

 const softDeleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const account = await AccountServices.softDeleteAccountFromDB(id); // soft delete

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Account deactivated successfully',
    data: account,
  });
});

 const getAccountsByType = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.params;
  const accounts = await AccountServices.getAccountByTypeFromDB(type);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Accounts retrieved successfully by type',
    data: accounts,
    meta:{
      total: accounts.length
    }
  });
});


export const AccountControllers = {
    createAccount,
    getAllAccounts,
    getAccountById,
    getAccountsByType,
    updateAccount,
    deleteAccount,
    softDeleteAccount
}