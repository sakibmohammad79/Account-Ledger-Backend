import { AppError } from "../../errors/ApiError";
import prisma from "../../utils/Prisma";
import status from "http-status";


const createAccountIntoDB = async(data: any) => {
    const existingAccount = await prisma.account.findUnique({
      where: { code: data.code }
    });

    if (existingAccount) {
      throw new AppError(status.BAD_REQUEST, 'Account code already exists',);
    }

    return await prisma.account.create({
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        category: data.category,
        description: data.description,
      }
    });
}

const getAllAccountsFromDB = async() => {
        const accountData = await prisma.account.findMany({
            where: {
                isActive: true,
                isDeleted: false
            },
            orderBy: [
            { type: 'asc' },
            { code: 'asc' }
            ]
        });
        return accountData;
}
const getAccountsByIdFromDB = async(id: string) => {
       const account = await prisma.account.findUnique({
        where: { id, isActive: true,
                isDeleted: false },
        include: {
            entries: {
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                transaction: true
            }
            }
        }
        });

        if (!account) {
        throw new AppError(status.NOT_FOUND, 'Account not found');
        }

    return account;
}

const updateAccountIntoDB = async(id: string, data: any) => {

     const account = await prisma.account.findUnique({ 
        where: { id,
            isActive: true,
            isDeleted: false 
        } });
    
    if (!account) {
      throw new AppError(status.NOT_FOUND, 'Account not found');
    }

    // Check if new code conflicts with existing account
    if (data.code && data.code !== account.code) {
      const existingAccount = await prisma.account.findUnique({
        where: { code: data.code }
      });

      if (existingAccount) {
        throw new AppError(status.BAD_REQUEST, 'Account code already exists');
      }
    }
    return await prisma.account.update({
      where: { id },
      data: {
        code: data.code,
        name: data.name,
        type: data.type,
        category: data.category,
        description: data.description,
        isActive: data.isActive
      }
    });
}

const deleteAccountFromDB = async (id: string) =>{
    // Check if account has any entries
    const entriesCount = await prisma.entry.count({
      where: { accountId: id }
    });

    if (entriesCount > 0) {
      throw new AppError(status.BAD_REQUEST, 'Cannot delete account with existing transactions');
    }

    return await prisma.account.delete({
      where: { id }
    });
}


const softDeleteAccountFromDB = async (id: string) =>{
    // Check if account has any entries
    const entriesCount = await prisma.entry.count({
      where: { accountId: id }
    });

    if (entriesCount > 0) {
      throw new AppError(status.BAD_REQUEST, 'Cannot delete account with existing transactions');
    }

    // Soft delete: set isActive = false, set isDeleted = true
    const updatedAccount = await prisma.account.update({
        where: { id },
        data: { isActive: false, isDeleted: true }
    });

    return updatedAccount;
}

const getAccountByTypeFromDB = async (type: any) => {
    return await prisma.account.findMany({
      where: { 
        type: type.toUpperCase(),
        isActive: true 
      },
      orderBy: { code: 'asc' }
    });
}


export const AccountServices = {
    getAllAccountsFromDB,
    createAccountIntoDB,
    getAccountsByIdFromDB,
    updateAccountIntoDB,
    softDeleteAccountFromDB,
    deleteAccountFromDB,
    getAccountByTypeFromDB
}