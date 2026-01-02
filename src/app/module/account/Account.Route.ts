import { Router } from "express";
import { AccountControllers } from "./Account.Controller";
import { validateRequest } from "../../middlewares/ValidateRequest";
import { createAccountSchema, getAccountByIdSchema, updateAccountSchema } from "./Account.Validation";
const router = Router();


// Get all accounts
router.get('/', AccountControllers.getAllAccounts);

// Get account by ID
router.get('/:id', validateRequest(getAccountByIdSchema), AccountControllers.getAccountById);

// Get accounts by type
router.get('/type/:type', AccountControllers.getAccountsByType);

// Create new account
router.post('/', validateRequest(createAccountSchema), AccountControllers.createAccount);

// Update account
router.patch('/:id', validateRequest(updateAccountSchema), AccountControllers.updateAccount);

// soft delete
router.delete('/soft/:id', AccountControllers.softDeleteAccount);


// Delete account
router.delete('/:id', AccountControllers.deleteAccount);




export const AccountRoutes = router;