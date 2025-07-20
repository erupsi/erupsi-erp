# Software Requirements Specification (SRS) Mini - Financial Service

## 1. Introduction
### 1.1 Purpose
This document outlines the requirements for the Financial Service as a microservice that manages all internal financial operations of the company, including the general ledger, accounts payable/receivable, tax calculations, and financial reporting.

### 1.2 Scope
The Financial Service is a backend microservice within an ERP ecosystem, responsible for core financial data and processes. It provides REST APIs for integration with frontend applications and other backend services.

## 2. General Description
### 2.1 System Context
- Part of a microservices-based ERP system
- Communicates with other services (Auth, Procurement, Order Management, HRM) via REST APIs
- Provides financial data to frontend applications via REST APIs

### 2.2 Modules
- Chart of Accounts (COA)
- General Journal
- General Ledger
- Financial Reporting
- Accounts Payable
- Accounts Receivable
- Payroll Aggregation (from HRM)
- Tax Calculation & Reporting

### 2.3 Integration Points
- Auth Service: Validates JWT for authentication/authorization
- Procurement Service: Retrieves vendor invoices for payables and taxes
- Order Management Service: Retrieves customer invoices for receivables and taxes
- HRM Service: Retrieves payroll summaries for journal entries and taxes
- Frontend: Exposes REST APIs for financial data and reporting

## 3. Functional Requirements
### 3.1 Chart of Accounts
- CRUD operations for accounts (assets, liabilities, equity, revenue, expenses)
- Supports hierarchical account structures

### 3.2 General Journal
- Records and manages double-entry bookkeeping transactions
- Validates that debits equal credits

### 3.3 General Ledger
- Maintains detailed transaction records per account
- Views account balances and history per period

### 3.4 Financial Reporting
- Generates balance sheets, profit & loss statements, trial balances

### 3.5 Accounts Payable
- Processes and tracks vendor invoices
- Manages outstanding liabilities
- Records outgoing payments

### 3.6 Accounts Receivable
- Processes and tracks customer invoices
- Manages uncollected receivables
- Records incoming cash receipts

### 3.7 Payroll Aggregation
- Records payroll summaries from HRM (not individual payrolls)

### 3.8 Tax Calculation & Reporting
- Manages tax rates
- Automates tax calculation on transactions
- Records tax liabilities
- Generates internal tax reports

## 4. Non-Functional Requirements
- **Performance:** Must handle up to 10,000 transactions/day with API response times <500ms
- **Scalability:** Supports horizontal scaling via Docker and stateless APIs
- **Security:** JWT-based authentication, role-based authorization, secure API endpoints
- **Reliability:** 99.9% uptime, automatic backups
- **Maintainability:** Modular codebase, API documentation via OpenAPI/Swagger
- **Auditability:** All financial transactions must be recorded and traceable

## 5. System Interfaces
- **REST API:** For frontend and inter-service communication
- **Database:** PostgreSQL for persistent storage
- **External Services:** Auth, Procurement, Order Management, HRM via REST

## 6. Constraints & Out of Scope
- Only core financial operations are within scope
- Advanced asset management, cost accounting, budgeting, treasury management are out of scope

---

# Financial Service

## A. Project Overview
This service is responsible for managing all internal financial aspects of the company, from general ledger management, accounts payable and receivable, internal tax calculations, and financial reporting. This service adheres to a strict microservices architecture, ensuring modularity, scalability, and independent deployment.

## Key Technologies
- **Backend:** Node.js (v20+ - Express.js)
- **Database:** PostgreSQL
- **Frontend (Conceptual):** Integrated via REST API (likely a separate frontend application, e.g., React with Tailwind CSS)
- **Authentication/Authorization:** JSON Web Tokens (JWT) via an Authentication Service (Auth Service)
- **Development Tools:** ESLint, Docker, Jest, OpenAPI (Swagger) for API documentation

## B. Service Functionality
This service provides essential functionalities required for financial accounting within an ERP.
Key Features:

### **1. Chart of Accounts (COA) Management**
- Create, Read, Update, Delete (CRUD) accounts (assets, liabilities, equity, revenue, expenses)
- Supports hierarchical account structures

### **2. General Journal Management**
- Records and manages all financial transactions using a double-entry bookkeeping system.
- Ability to create, view, and detail journal entries.
- Validation to ensure debits equal credits for each journal entry.

### **3. General Ledger Management**
- Maintains detailed records of all financial transactions per account.
- Ability to view account balances and transaction history for specific time periods.

### **4. Financial Reporting**
Generates basic financial reports:
- **Balance Sheet:** An overview of assets, liabilities, and equity at a specific point in time.
- **Profit & Loss Statement (Income Statement):** A summary of revenues, expenses, and net profit/loss over a specific period.
- **Trial Balance:** A list of all general ledger accounts with their debit and credit balances, ensuring balance.

### **5. Accounts Payable Management**
- Processes and tracks vendor invoices.
- Manages unpaid obligations to suppliers.
- Records and tracks outgoing payments.

### **6. Accounts Receivable Management**
- Processes and tracks customer invoices.
- Manages uncollected receivables from customers.
- Records and tracks incoming cash receipts.

### **7. Payroll Recording (Aggregate Integration)**
- Ability to record summarized payroll data (total salary expense, total income tax payable, total BPJS contributions payable, etc.) received from the Human Resources Management Service (HRM Service) into the general ledger. **This service does not perform individual payroll calculations or manage employee deduction details.**

### **8. Company Tax Calculation and Recording**
- **Tax Rate Configuration:** Manages tax rates that are company obligations (e.g., VAT, specific Income Tax articles).
- **Transactional Tax Calculation:** Automates the calculation of Input/Output VAT on integrated purchase/sales invoices.
- **Tax Liability Recording:** Automatically records tax liabilities arising from transactions and payroll summaries into the general ledger.
- **Internal Tax Reports:** Generates summary tax reports (e.g., total Input/Output VAT, total Income Tax withheld by the company) for internal purposes or as a basis for consolidating company tax data.

## C. Interaction Requirements with Other Services
As a microservice, the Financial Service communicates with other services in the ERP ecosystem primarily through REST API calls, ensuring clear API contracts for each interaction.

### 1. Consuming Data from Other Services
The Financial Service pulls necessary data from other services via the REST APIs they expose. Each service will have its own API contract, which the Financial Service adheres to.

| Service                   | Purpose                                                                                                                                                                                          | Interaction                                                                                                                                                                                                                                                                                         |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication (Auth)     | User authentication and authorization.                                                                                                                                                           | The Financial Service validates incoming JWTs issued by the Authentication Service to ensure legitimate requests and determine user roles/permissions.                                                                                                                                             |
| Procurement               | Retrieves Purchase Order (PO) details and Vendor Invoices, including relevant pricing and tax information for accounts payable and Input VAT recording.                                             | The Financial Service will make API calls (e.g., `GET /api/procurement/invoices?status=ready_for_finance`) to retrieve vendor invoices that need processing.                                                                                                                                         |
| Order Management          | Retrieves Sales Order details and Customer Invoices, including relevant pricing and tax information for accounts receivable and Output VAT recording.                                              | The Financial Service will make API calls (e.g., `GET /api/orders/invoices?status=ready_for_finance`) to retrieve customer invoices that need processing.                                                                                                                                             |
| Human Resources Management (HRM) | Retrieves summarized payroll data covering total salary expense, total PPh 21 (Income Tax Article 21) withheld from employees, and total BPJS contributions that are company/employee obligations. | The Financial Service will make API calls (e.g., `GET /api/hrm/payroll/summary?period=2024-06`) to fetch these aggregate figures for journal entries and company tax liability calculations.                                                                                                            |

### 2. Providing Data to Other Services
The Financial Service provides financial data to other services through exposed REST APIs, primarily allowing them to GET information.

| Service                   | Purpose                                                                          | Interaction                                                                                                                                                                                 |
| :------------------------ | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Procurement               | Provides vendor invoice payment status.                                          | The Procurement Service can make API calls (e.g., `GET /api/finance/ap-status/{invoiceId}`) to query the payment status of specific vendor invoices managed by the Financial Service.        |
| Order Management          | Provides customer invoice payment status.                                        | The Order Management Service can make API calls (e.g., `GET /api/finance/ar-status/{invoiceId}`) to query the payment status of specific customer invoices.                                  |

## D. Service Boundaries
The Financial Service adheres to clear boundaries to maintain its focus and prevent undue scope creep, in line with microservices principles.

***In Scope (Covered/Planned in the near future)***
- Chart of Accounts Management
- General Journal & General Ledger Management
- Core Financial Reports (Balance Sheet, Profit & Loss Statement, Trial Balance)
- Accounts Payable Management (Vendor Invoice Processing, Outgoing Payments)
- Accounts Receivable Management (Customer Invoice Processing, Incoming Cash Receipts)
- Basic Payroll Data Recording (integration with HRM Service)
- Basic Cash and Bank Reconciliation (potentially manual)
- Internal Tax Management (Transactional VAT Calculation, PPh 21 from Payroll, Tax Liability Recording, Internal Summary Tax Reports)

***Out of Scope (To be handled by Separate Services or Future Phases)***
- **Complex Asset Management:** Detailed tracking, depreciation schedules, and fixed asset lifecycle management.
- **Cost Accounting:** Advanced cost analysis, variance analysis, and job costing.
- **Budgeting & Forecasting:** Tools for creating, managing, and tracking budgets and financial forecasts.
- **Treasury Management:** Sophisticated cash management, investments, and foreign exchange (FX) hedging.
- **External Tax Filing/Compliance Reporting:** Generation of official tax reports in specific formats required for direct submission to government bodies (e.g., e-SPT, e-Faktur in upload-ready XML/CSV formats). This service will provide the underlying data, but final reporting file generation is out of scope.

## E. Access Roles to Financial Service Features
Access to Financial Service functionality is strictly controlled based on predefined user roles, validated via JWT tokens issued by the Authentication Service. Each incoming request includes a JWT payload containing user information and their assigned roles, which is then used by the Financial Service for granular authorization checks.

The following roles define the access levels:

1.  **ERP ADMIN:**
   -   **Full CRUD Access:** Chart of Accounts, Journal Entries, Tax Rate Configuration.
   -   **Full Read Access:** All Financial Reports, Accounts Payable, Accounts Receivable, General Ledger, Internal Tax Reports.
   -   **Full Management:** Payment processing, other company financial and tax configurations.

2.  **FINANCE MANAGER:**
   -   **Read Access:** Chart of Accounts, Journal Entries, General Ledger, Tax Rate Configuration.
   -   **Approval/Update Access:** Journal entries requiring approval, Accounts Payable (payment approval), Accounts Receivable (cash receipt approval), Validation & Approval of Internal Tax Reports.
   -   **Full Read Access:** All Financial Reports, Internal Tax Reports.

3.  **ACCOUNTING STAFF:**
   -   **Read Access:** Chart of Accounts, General Ledger, basic Financial Reports, Internal Tax Reports.
   -   **Create/Update/Delete Access:** Journal Entries (subject to manager approval).
   -   **Tax-Related Access:** Input data that triggers transactional tax calculations, view company tax liability summaries.

4.  **ACCOUNTS PAYABLE STAFF:**
   -   **Create/Update/Delete Access:** Incoming Vendor Invoices (often integrated from Procurement), Outgoing Payments.
   -   **Read Access:** Purchase invoice and payment status, tax information on purchase invoices.

5.  **ACCOUNTS RECEIVABLE STAFF:**
   -   **Create/Update/Delete Access:** Incoming Customer Invoices (often integrated from Order Management), Incoming Cash Receipts.
   -   **Read Access:** Sales invoice and cash receipt status, tax information on sales invoices.

6.  **AUDITOR:**
   -   **Read-Only Access:** All company financial and tax data (COA, Journal Entries, General Ledger, Internal Tax Reports) and Financial Reports. No modification capabilities.

7.  **PROCUREMENT OFFICER:**
   -   **Limited Read Access:** Payment status of purchase invoices they initiated, tax details related to purchase invoices.

8.  **SALES OFFICER:**
   -   **Limited Read Access:** Cash receipt status of sales invoices they initiated, tax details related to sales invoices.

---