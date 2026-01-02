"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const express_1 = require("express");
const Account_Controller_1 = require("./Account.Controller");
const ValidateRequest_1 = require("../../middlewares/ValidateRequest");
const Account_Validation_1 = require("./Account.Validation");
const router = (0, express_1.Router)();
// Get all accounts
router.get('/', Account_Controller_1.AccountControllers.getAllAccounts);
// Get account by ID
router.get('/:id', (0, ValidateRequest_1.validateRequest)(Account_Validation_1.getAccountByIdSchema), Account_Controller_1.AccountControllers.getAccountById);
// Get accounts by type
router.get('/type/:type', Account_Controller_1.AccountControllers.getAccountsByType);
// Create new account
router.post('/', (0, ValidateRequest_1.validateRequest)(Account_Validation_1.createAccountSchema), Account_Controller_1.AccountControllers.createAccount);
// Update account
router.patch('/:id', (0, ValidateRequest_1.validateRequest)(Account_Validation_1.updateAccountSchema), Account_Controller_1.AccountControllers.updateAccount);
// soft delete
router.delete('/soft/:id', Account_Controller_1.AccountControllers.softDeleteAccount);
// Delete account
router.delete('/:id', Account_Controller_1.AccountControllers.deleteAccount);
exports.AccountRoutes = router;
