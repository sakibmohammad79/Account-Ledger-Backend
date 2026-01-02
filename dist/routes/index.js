"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Account_Route_1 = require("../app/module/account/Account.Route");
const Transaction_Route_1 = require("../app/module/transaction/Transaction.Route");
const Report_Route_1 = require("../app/module/report/Report.Route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/account",
        route: Account_Route_1.AccountRoutes
    },
    {
        path: "/transaction",
        route: Transaction_Route_1.TransactionRoutes
    },
    {
        path: "/report",
        route: Report_Route_1.ReportRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
