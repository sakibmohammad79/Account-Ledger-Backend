import { Router } from "express";
import { AccountRoutes } from "../app/module/account/Account.Route";


const router = Router();

const moduleRoutes = [
    {
        path: "/account",
        route: AccountRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
