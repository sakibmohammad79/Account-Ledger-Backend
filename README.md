# Accounting Ledger Backend API

Double-Entry Accounting System Backend built with Express.js, Prisma, and PostgreSQL.

## 🚀 Features

- ✅ Double-Entry Accounting System
- ✅ Transaction Management (SALES, PURCHASE, RECEIPT, PAYMENT)
- ✅ Chart of Accounts Management
- ✅ Financial Reports:
  - Journal Report
  - Balance Sheet
  - Income Statement (P&L)
  - Trial Balance
  - Account Ledger
- ✅ Data Validation & Error Handling
- ✅ RESTful API Design

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Yarn package manager

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <https://github.com/sakibmohammad79/Account-Ledger-Backend>
cd accounting-backend
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/accounting_db?schema=public"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Create PostgreSQL database
```bash
createdb accounting_db
```

Or using psql:
```sql
CREATE DATABASE accounting_db;
```

### 5. Run Prisma migrations
```bash
yarn prisma:generate
yarn prisma:migrate
```

### 6. Seed the database (Optional)
```bash
yarn prisma:seed
```

### 7. Start the server
```bash
# Development mode with auto-reload
yarn dev

# Production mode
yarn start
```

Server will run on: `http://localhost:5000`

## 📚 API Documentation

### Health Check
```
GET /api/health
```

### Accounts

```
GET    /api/accounts              - Get all accounts
GET    /api/accounts/:id          - Get account by ID
POST   /api/accounts              - Create new account
PUT    /api/accounts/:id          - Update account
DELETE /api/accounts/:id          - Delete account
GET    /api/accounts/type/:type   - Get accounts by type
```

### Transactions

```
GET    /api/transactions                        - Get all transactions
GET    /api/transactions/:id                    - Get transaction by ID
POST   /api/transactions                        - Create new transaction
PUT    /api/transactions/:id                    - Update transaction
DELETE /api/transactions/:id                    - Delete transaction
GET    /api/transactions/type/:type             - Get by type
GET    /api/transactions/date-range/:start/:end - Get by date range
```

### Reports

```
GET /api/reports/journal           - Journal Report
GET /api/reports/balance-sheet     - Balance Sheet
GET /api/reports/income-statement  - Income Statement (P&L)
GET /api/reports/trial-balance     - Trial Balance
GET /api/reports/ledger/:accountId - Account Ledger
```

## 📝 Sample API Requests

### Create Account
```bash
POST /api/accounts
Content-Type: application/json

{
  "code": "1010",
  "name": "Cash",
  "type": "ASSET",
  "category": "CURRENT_ASSET",
  "description": "Cash in hand"
}
```

### Create Transaction
```bash
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
```

### Get Balance Sheet
```bash
GET /api/reports/balance-sheet?asOfDate=2024-12-31
```

### Get Income Statement
```bash
GET /api/reports/income-statement?startDate=2024-01-01&endDate=2024-12-31
```

## 🗂️ Project Structure

```
accounting-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Seed data
├── src/
│   ├── config/
│   │   └── database.js    # Prisma client
│   ├── controllers/       # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middlewares/      # Custom middleware
│   └── utils/            # Helper functions
├── .env                  # Environment variables
├── server.js            # Entry point
└── package.json
```

## 🔐 Account Types & Categories

### Account Types
- ASSET
- LIABILITY
- EQUITY
- REVENUE
- EXPENSE

### Account Categories
- CURRENT_ASSET
- FIXED_ASSET
- CURRENT_LIABILITY
- LONG_TERM_LIABILITY
- OWNER_EQUITY
- RETAINED_EARNINGS
- OPERATING_REVENUE
- NON_OPERATING_REVENUE
- OPERATING_EXPENSE
- NON_OPERATING_EXPENSE

### Transaction Types
- SALES
- PURCHASE
- RECEIPT
- PAYMENT
- GENERAL

## 🧪 Testing with Prisma Studio

Open Prisma Studio to view and manage data:
```bash
yarn prisma:studio
```

Access at: `http://localhost:5555`

## 📊 Database Schema

The system uses three main tables:
- `Account` - Chart of accounts
- `Transaction` - Transaction headers
- `Entry` - Journal entries (double-entry line items)

## 🐛 Error Handling

All API errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for FytoByte Technical Assessment