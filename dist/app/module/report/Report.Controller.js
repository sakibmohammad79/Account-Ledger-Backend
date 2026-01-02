"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportControllers = void 0;
const CatchAsync_1 = require("../../utils/CatchAsync");
const SendResponse_1 = require("../../utils/SendResponse");
const Report_Service_1 = require("./Report.Service");
const ParseSingleString_1 = require("../../utils/ParseSingleString");
/* =========================
   Journal Report
========================= */
const getJournalReport = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate, page = "1", limit = "50" } = req.query;
    const result = await Report_Service_1.ReportServices.getJournalReport({
        startDate: (0, ParseSingleString_1.parseQueryParam)(startDate),
        endDate: (0, ParseSingleString_1.parseQueryParam)(endDate),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    });
    (0, SendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Journal report fetched successfully",
        data: result,
    });
});
/* =========================
   Balance Sheet
========================= */
const getBalanceSheet = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { asOfDate } = req.query;
    const result = await Report_Service_1.ReportServices.getBalanceSheet(asOfDate);
    (0, SendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Balance sheet fetched successfully",
        data: result,
    });
});
/* =========================
   Income Statement
========================= */
const getIncomeStatement = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { startDate, endDate } = req.query;
    const result = await Report_Service_1.ReportServices.getIncomeStatement(startDate, endDate);
    (0, SendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Income statement fetched successfully",
        data: result,
    });
});
/* =========================
   Trial Balance
========================= */
const getTrialBalance = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { asOfDate } = req.query;
    const result = await Report_Service_1.ReportServices.getTrialBalance(asOfDate);
    (0, SendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Trial balance fetched successfully",
        data: result,
    });
});
/* =========================
   Account Ledger
========================= */
const getAccountLedger = (0, CatchAsync_1.catchAsync)(async (req, res) => {
    const { accountId } = req.params;
    const { startDate, endDate, page = "1", limit = "50" } = req.query;
    const result = await Report_Service_1.ReportServices.getAccountLedger({
        accountId,
        startDate: (0, ParseSingleString_1.parseQueryParam)(startDate),
        endDate: (0, ParseSingleString_1.parseQueryParam)(endDate),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    });
    (0, SendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Account ledger fetched successfully",
        data: result,
    });
});
exports.ReportControllers = {
    getJournalReport,
    getBalanceSheet,
    getIncomeStatement,
    getAccountLedger,
    getTrialBalance
};
