import { Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync";
import { sendResponse } from "../../utils/SendResponse";
import { ReportServices } from "./Report.Service";
import { parseQueryParam } from "../../utils/ParseSingleString";


/* =========================
   Journal Report
========================= */
 const getJournalReport = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate, page = "1", limit = "50" } = req.query;

  const result = await ReportServices.getJournalReport({
    startDate : parseQueryParam(startDate),
    endDate: parseQueryParam(endDate),
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Journal report fetched successfully",
    data: result,
  });
});

/* =========================
   Balance Sheet
========================= */
 const getBalanceSheet = catchAsync(async (req: Request, res: Response) => {
  const { asOfDate } = req.query;

  const result = await ReportServices.getBalanceSheet(asOfDate as any);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Balance sheet fetched successfully",
    data: result,
  });
});

/* =========================
   Income Statement
========================= */
 const getIncomeStatement = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const result = await ReportServices.getIncomeStatement(startDate as string, endDate as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Income statement fetched successfully",
    data: result,
  });
});

/* =========================
   Trial Balance
========================= */
 const getTrialBalance = catchAsync(async (req: Request, res: Response) => {
  const { asOfDate } = req.query;

  const result = await ReportServices.getTrialBalance(asOfDate as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Trial balance fetched successfully",
    data: result,
  });
});

/* =========================
   Account Ledger
========================= */
 const getAccountLedger = catchAsync(async (req: Request, res: Response) => {
  const { accountId } = req.params;
  const { startDate, endDate, page = "1", limit = "50" } = req.query;

  const result = await ReportServices.getAccountLedger({
    accountId,
    startDate : parseQueryParam(startDate),
    endDate: parseQueryParam(endDate),
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Account ledger fetched successfully",
    data: result,
  });
});

export const ReportControllers = {
    getJournalReport,
    getBalanceSheet,
    getIncomeStatement,
    getAccountLedger,
    getTrialBalance
}
