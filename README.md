Accounting Ledger Backend API
Double-Entry Accounting System Backend built with Express.js, TypeScript, Prisma, and PostgreSQL.

Features : 

✅ Double-Entry Accounting System
✅ Transaction Management (SALES, PURCHASE, RECEIPT, PAYMENT)
✅ Chart of Accounts Management
✅ Financial Reports:

Journal Report
Balance Sheet
Income Statement (P&L)
Trial Balance
Account Ledger


✅ Data Validation & Error Handling
✅ RESTful API Design

📋 Prerequisites

Node.js (v16 or higher)
PostgreSQL (v12 or higher)
Yarn package manager

🔧 Installation
1. Clone the repository
git clone <https://github.com/sakibmohammad79/Account-Ledger-Backend>
cd accounting-backend
2. Install dependencies
yarn install
3. Setup environment variables
cp .env.example .env
Edit .env file with your database credentials:
DATABASE_URL="postgresql://username:password@localhost:5432/accounting_db?schema=public"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
4. Create PostgreSQL database
bashcreatedb accounting_db
Or using psql:
sqlCREATE DATABASE accounting_db;
5. Run Prisma migrations
npx prisma generate
npx prisma migrate dev
6. Start the server
Development mode with auto-reload
yarn dev

# Production mode
yarn dev
Server will run on: http://localhost:5000


📚 API Documentation
Health Check

GET/api/health

Accounts Endpoints

GET/api/account              → Get all accounts
GET/api/account/:id          → Get account by ID
POST/api/account              → Create new account
PUT/api/account/:id          → Update account
DELETE/api/account/:id          → Hard delete account
DELETE/api/account/soft/:id     → Soft delete account
GET/api/account/type/:type   → Get accounts by type (e.g., ASSET)

Transactions Endpoints

GET/api/transaction                        → Get all transactions

GET/api/transaction/:id                    → Get transaction by ID

POST/api/transaction                        → Create new transaction

PUT/api/transaction/:id                    → Update transaction

DELETE/api/transaction/:id                    → Delete transaction

GET/api/transaction/type/:type             → Get transactions by type

GET/api/transaction/date-range/:start/:end → Get transactions by date range


Reports Endpoints

GET/api/report/journal          → Journal Report

GET/api/report/balance-sheet    → Balance Sheet (optional query: ?asOfDate=YYYY-MM-DD)

GET/api/report/income-statement → Income Statement (P&L) (queries: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD)

GET/api/report/trial-balance    → Trial Balance

GET/api/report/ledger/:accountId → Account Ledger


📝 Sample API Requests

Create Account
POST /api/accounts

Content-Type: application/json

{
  "code": "1010",
  "name": "Cash",
  "type": "ASSET",
  "category": "CURRENT_ASSET",
  "description": "Cash in hand"
}

Create Transaction
POST /api/transactions
Content-Type: application/json

{
  "type": "SALES",
  "date": "2024-01-15",
  "description": "Sales to customer - Cash",
  "reference": "INV-001",
  "entries": [
    {
      "accountId": "cash-account-id",
      "debit": 50000,
      "credit": 0,
      "description": "Cash received"
    },
    {
      "accountId": "revenue-account-id",
      "debit": 0,
      "credit": 50000,
      "description": "Sales revenue"
    }
  ]
}
Get Balance Sheet
GET /api/reports/balance-sheet?asOfDate=2024-12-31
Get Income Statement
GET /api/reports/income-statement?startDate=2024-01-01&endDate=2024-12-31

🔐 Account Types & Categories

Account Types:

ASSET
LIABILITY
EQUITY
REVENUE
EXPENSE

Account Categories:

CURRENT_ASSET
FIXED_ASSET
CURRENT_LIABILITY
LONG_TERM_LIABILITY
OWNER_EQUITY
RETAINED_EARNINGS
OPERATING_REVENUE
NON_OPERATING_REVENUE
OPERATING_EXPENSE
NON_OPERATING_EXPENSE

Transaction Types:

SALES
PURCHASE
RECEIPT
PAYMENT
GENERAL

🧪 Testing with Prisma Studio
Open Prisma Studio to view and manage data:
npx prisma studio
Access at: http://localhost:5555
📊 Database Schema
The system uses three main tables:

Account - Chart of accounts
Transaction - Transaction headers
Entry - Journal entries (double-entry line items)

🐛 Error Handling
All API errors follow this format:
json{
  "success": false,
  "error": "Error message here"
}

👨‍💻 Author
Built with ❤️ for FytoByte Technical Assessment