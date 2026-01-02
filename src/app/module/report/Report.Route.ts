import { Router } from "express";
import { ReportControllers } from "./Report.Controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { accountLedgerSchema, balanceSheetQuerySchema, incomeStatementQuerySchema, journalReportQuerySchema, trialBalanceQuerySchema } from "./Report.Validation";
const router = Router();


// Journal Report
router.get('/journal', validateRequest(journalReportQuerySchema), ReportControllers.getJournalReport);

// Balance Sheet
router.get('/balance-sheet', validateRequest(balanceSheetQuerySchema), ReportControllers.getBalanceSheet);

// Income Statement (P&L)
router.get('/income-statement', validateRequest(incomeStatementQuerySchema), ReportControllers.getIncomeStatement);

// Trial Balance
router.get('/trial-balance', validateRequest(trialBalanceQuerySchema), ReportControllers.getTrialBalance);

// Account Ledger
router.get('/ledger/:accountId', validateRequest(accountLedgerSchema), ReportControllers.getAccountLedger);

export const ReportRoutes = router;