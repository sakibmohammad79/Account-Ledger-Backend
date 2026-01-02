"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRoutes = void 0;
const express_1 = require("express");
const Report_Controller_1 = require("./Report.Controller");
const ValidateRequest_1 = require("../../middlewares/ValidateRequest");
const Report_Validation_1 = require("./Report.Validation");
const router = (0, express_1.Router)();
// Journal Report
router.get('/journal', (0, ValidateRequest_1.validateRequest)(Report_Validation_1.journalReportQuerySchema), Report_Controller_1.ReportControllers.getJournalReport);
// Balance Sheet
router.get('/balance-sheet', (0, ValidateRequest_1.validateRequest)(Report_Validation_1.balanceSheetQuerySchema), Report_Controller_1.ReportControllers.getBalanceSheet);
// Income Statement (P&L)
router.get('/income-statement', (0, ValidateRequest_1.validateRequest)(Report_Validation_1.incomeStatementQuerySchema), Report_Controller_1.ReportControllers.getIncomeStatement);
// Trial Balance
router.get('/trial-balance', (0, ValidateRequest_1.validateRequest)(Report_Validation_1.trialBalanceQuerySchema), Report_Controller_1.ReportControllers.getTrialBalance);
// Account Ledger
router.get('/ledger/:accountId', (0, ValidateRequest_1.validateRequest)(Report_Validation_1.accountLedgerSchema), Report_Controller_1.ReportControllers.getAccountLedger);
exports.ReportRoutes = router;
