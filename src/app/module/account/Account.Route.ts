import { Router } from "express";
import { AccountControllers } from "./Account.Controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createAccountSchema, getAccountByIdSchema, updateAccountSchema } from "./Account.Validation";
const router = Router();


// Get all accounts
router.get('/', AccountControllers.getAllAccounts);

// Get account by ID
router.get('/:id', validateRequest(getAccountByIdSchema), AccountControllers.getAccountById);

// Create new account
router.post('/', validateRequest(createAccountSchema), AccountControllers.createAccount);

// Update account
router.put('/:id', validateRequest(updateAccountSchema), AccountControllers.updateAccount);

// Delete account
router.delete('/:id', AccountControllers.deleteAccount);

router.delete('soft/:id', AccountControllers.deleteAccount);

// Get accounts by type
router.get('/type/:type', AccountControllers.getAccountsByType);

export const AccountRoutes = router;