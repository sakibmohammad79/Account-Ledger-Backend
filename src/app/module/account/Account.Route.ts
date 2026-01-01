import { Router } from "express";
import { AccountControllers } from "./Account.Controller";
const router = Router();


// Get all accounts
router.get('/', AccountControllers.getAllAccounts);

// Get account by ID
router.get('/:id', AccountControllers.getAccountById);

// Create new account
router.post('/', AccountControllers.createAccount);

// Update account
router.put('/:id', AccountControllers.updateAccount);

// Delete account
router.delete('/:id', AccountControllers.deleteAccount);

router.delete('soft/:id', AccountControllers.deleteAccount);

// Get accounts by type
router.get('/type/:type', AccountControllers.getAccountsByType);

export const AccountRoutes = router;