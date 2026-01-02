import { Router } from "express";
import { AccountRoutes } from "../app/module/account/Account.Route";
import { TransactionRoutes } from "../app/module/transaction/Transaction.Route";


const router = Router();

const moduleRoutes = [
    {
        path: "/account",
        route: AccountRoutes
    },
    {
        path: "/transaction",
        route: TransactionRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
