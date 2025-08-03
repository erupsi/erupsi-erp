# **Software Requirements Specification: Inventory Service Module for Erupsi ERP**

## **Part 1: General System Overview**

### **1.1 Introduction and Purpose**

This Software Requirements Specification (SRS) document provides a comprehensive definition of the functional and non-functional requirements for the Inventory Service Module. This module is a core component of the broader Erupsi Enterprise Resource Planning (ERP) project. The primary purpose of the module is to establish and maintain a centralized, real-time, and authoritative "single source of truth" for all data and processes related to the company's inventory.

The strategic objectives of this module are multifaceted. It aims to optimize inventory levels, increase operational efficiency, enhance supplier relationships, and provide data-driven insights for strategic decision-making.

The scope of this service is comprehensive, integrating several core ERP functions into a unified system. It encompasses five primary functional areas:

1. **Inventory Management:** Serving as the master record for all products and tracking stock levels, value, and advanced attributes in real-time.  
2. **Warehouse Management:** Overseeing the physical operations within storage facilities, including multi-location tracking, stock transfers, and the pick, pack, and ship workflow.  
3. **Supply Chain & Procurement Management:** Handling the entire lifecycle of supplier relationships and purchasing, from vendor management to purchase order processing and goods receipt.  
4. **Order Management:** Managing the customer order lifecycle from creation and inventory allocation to fulfillment and returns.  
5. **Reporting & Analytics:** Providing data-driven dashboards, reports, and forecasting tools for strategic decision-making.

### **1.2 User Personas and Role-Based Access Control (RBAC)**

The system will be utilized by a variety of internal personnel, each with distinct responsibilities and access requirements. A granular Role-Based Access Control (RBAC) system is a fundamental architectural requirement.

The primary user personas are defined as follows:

* **System Administrator:** Possesses superintendent-level privileges across the entire module.  
* **Warehouse Manager:** Responsible for the physical and digital management of inventory.  
* **Procurement Officer:** Manages the procurement lifecycle and supplier relationships.  
* **Sales Representative:** Manages customer sales and requires real-time visibility into product availability.  
* **Finance Analyst:** Requires read-only access to the financial implications of inventory management.

The following matrix provides a clear reference for the default permissions assigned to each role, which will be enforced by the system's authorization middleware.

| Feature/Resource | System Admin | Warehouse Manager | Procurement Officer | Sales Rep | Finance Analyst |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Product Catalog | CRUD | R | R | R | R |
| Stock Levels | CRUD | CRUD | R | R | R |
| Warehouse Locations | CRUD | CRUD | R | R | R |
| Inventory Adjustments | CRUD | CUD | R | \- | R |
| Supplier Data | CRUD | R | CRUD | R | R |
| Purchase Orders | CRUD | R | CRUD | R | R |
| Sales Orders | CRUD | R/U (Status) | R | CRUD | R |
| Inventory Reports | R | R | R (Supplier) | R (Sales) | R |
| System Configuration | CRUD | \- | \- | \- | \- |
| *(CRUD \= Create, Read, Update, Delete; R \= Read; CUD \= Create, Update, Delete)* |  |  |  |  |  |

### **1.3 General Constraints, Assumptions, and Dependencies**

This section outlines the key technical and operational parameters that bound the project.

**Constraints:**

* **Project Standards:** All development must adhere to the standards and practices defined in the project's CONTRIBUTING.md document. This includes guidelines for project structure, coding conventions, branching, testing, and documentation.  
* **Mandatory Technology Stack:** The implementation of this module is strictly bound to the following technologies:  
  * **Backend:** Express.js framework running on Node.js.  
  * **Frontend:** React library for building the single-page application.  
  * **Styling:** Tailwind CSS for the user interface design system.

**Assumptions:**

* **Cloud Deployment Environment:** The system is assumed to be deployed on a modern cloud infrastructure (e.g., AWS, Azure, Google Cloud).  
* **Future Module Integration:** The architecture is designed with extensibility and interoperability as core principles to support future ERP modules.

**Dependencies:**

* **Relational Database System:** The module is dependent on a robust relational database management system (RDBMS), such as PostgreSQL.  
* **Third-Party Service APIs:** Certain functionalities may depend on integration with external third-party services (e.g., shipping carriers, email providers).

## **Part 2: System Architecture and Data Model**

### **2.1 High-Level Architecture**

The system will be implemented using a modern, decoupled **Client-Server Architecture** within a **monorepo** structure, as defined in the project's CONTRIBUTING.md.

* **Client (Frontend):** A dynamic Single Page Application (SPA) built using **React** and styled with **Tailwind CSS**. It will be located in the src/frontend directory of the monorepo.  
* **Server (Backend):** The backend will be a stateless RESTful API developed with the **Express.js** framework. The Inventory Service will be a self-contained microservice within the monorepo, following the specified project structure:  
  src/backend/inventory-service/  
  ├── .dockerignore  
  ├── .env.example  
  ├── Dockerfile  
  ├── openapi.yaml         \<-- Formal API contract  
  ├── package.json         \<-- Managed by npm workspaces  
  ├── \_\_test\_\_/  
  │   └── \*.test.js        \<-- Jest unit tests  
  └── src/  
      ├── index.js         \<-- Service entry point  
      └── routes/          \<-- API route definitions

  This modular structure ensures that the service is loosely coupled and can be developed, tested, and deployed independently.  
* **Database:** A relational database (PostgreSQL) is specified to enforce data integrity and support complex transactions. Each service will have its own dedicated database schema, managed via the compose.yaml configuration.  
* **Authentication:** Security for the API will be managed through **JSON Web Tokens (JWT)**.

### **2.2 Core Data Model**

The database schema is the structural foundation of the application. The design separates distinct business concepts into their own tables and uses foreign keys to establish clear, logical relationships. A key feature is the use of an immutable InventoryTransactions table, which provides a complete, auditable ledger of all stock movements.

## TO BE UPDATED
| Table | Column Name | Data Type | Constraints | Description |
| :---- | :---- | :---- | :---- | :---- |
| **Products** | id | UUID | Primary Key | Unique identifier for the product master. |
|  | name | VARCHAR(255) | Not Null | The common name of the product. |
|  | description | TEXT |  | Detailed marketing description. |
| **ProductVariants** | id | UUID | Primary Key | Unique identifier for the specific variant. |
|  | product\_id | UUID | Foreign Key (Products) | Links to the master product. |
|  | sku | VARCHAR(100) | Not Null, Unique | Stock Keeping Unit. |
|  | price | DECIMAL(10, 2\) | Not Null | The selling price of this variant. |
|  | attributes | JSONB |  | e.g., {"color": "Red", "size": "M"}. |
| **InventoryLevels** | id | UUID | Primary Key | Unique identifier for this inventory record. |
|  | variant\_id | UUID | Foreign Key (ProductVariants) | The product variant being tracked. |
|  | warehouse\_id | UUID | Foreign Key (Warehouses) | The location where the stock is held. |
|  | quantity\_on\_hand | INTEGER | Not Null | The current calculated stock level. |
| **InventoryTransactions** | id | UUID | Primary Key | Unique identifier for the transaction log entry. |
|  | variant\_id | UUID | Foreign Key | The product variant in the transaction. |
|  | warehouse\_id | UUID | Foreign Key | The location where the transaction occurred. |
|  | type | VARCHAR(50) | Not Null | e.g., PURCHASE\_RECEIPT, SALE\_SHIPMENT. |
|  | quantity\_change | INTEGER | Not Null | The change in quantity (+ or \-). |
| **Suppliers** | id | UUID | Primary Key | Unique identifier for the supplier. |
|  | name | VARCHAR(255) | Not Null, Unique | Legal name of the supplier company. |
| **PurchaseOrders** | id | UUID | Primary Key | Unique identifier for the purchase order. |
|  | po\_number | VARCHAR(50) | Not Null, Unique | Human-readable PO number. |
|  | supplier\_id | UUID | Foreign Key (Suppliers) | The supplier for the order. |
|  | status | VARCHAR(50) | Not Null | e.g., DRAFT, APPROVED, COMPLETED. |
| **SalesOrders** | id | UUID | Primary Key | Unique identifier for the sales order. |
|  | so\_number | VARCHAR(50) | Not Null, Unique | Human-readable SO number. |
|  | status | VARCHAR(50) | Not Null | e.g., PENDING, SHIPPED, CANCELLED. |

## **Part 3: Functional Requirements**

This section details the specific features and system behaviors.

### **3.1 Inventory Management**

* **FR-3.1.1 (Product Catalog):** A centralized repository for all product information, including creation, variant management, image uploads, categorization, barcode generation, and advanced search/filtering.  
* **FR-3.1.2 (Real-Time Stock Levels):** The UI must display real-time stock levels, immediately reflecting all inventory transactions.  
* **FR-3.1.3 (Stock Adjustments):** Allow authorized users to make manual stock adjustments with mandatory reason codes for auditability.  
* **FR-3.1.4 (Cycle Counting):** Facilitate cycle counting workflows to verify system accuracy against physical counts.  
* **FR-3.1.5 (Advanced Tracking):** Support tracking by Lot/Batch Number and Expiration Date to enable FIFO/FEFO strategies.  
* **FR-3.1.6 (Low-Stock Alerts):** Automatically notify relevant personnel when stock levels fall below pre-defined reorder points.  
* **FR-3.1.7 (Inventory Valuation):** Generate financial reports showing the total value of inventory based on a standard costing method.

### **3.2 Warehouse Management**

* **FR-3.2.1 (Multi-Location Management):** Support multiple, distinct warehouse locations with location-specific tracking.  
* **FR-3.2.2 (Stock Transfers):** Provide a workflow to initiate, track, and complete the transfer of stock between locations.  
* **FR-3.2.3 (Pick, Pack, Ship Workflow):** Guide warehouse staff through an efficient, scanner-friendly fulfillment process from generating pick lists to dispatching shipments.

### **3.3 Supply Chain & Procurement Management**

* **FR-3.3.1 (Supplier Database):** Maintain a comprehensive database of all approved suppliers.  
* **FR-3.3.2 (Purchase Order Workflow):** Support a full PO lifecycle, including creation, multi-level approvals, and dispatch to suppliers.  
* **FR-3.3.3 (Goods Receipt Note \- GRN):** Manage the receipt of goods against purchase orders, handling partial deliveries and discrepancies.  
* **FR-3.3.4 (Supplier Performance Tracking):** Automatically collect and display KPIs for supplier performance, such as on-time delivery rates.

### **3.4 Order Management**

* **FR-3.4.1 (Sales Order Creation):** Allow creation of sales orders with real-time stock availability checks.  
* **FR-3.4.2 (Inventory Allocation):** Automatically reserve inventory when a sales order is confirmed.  
* **FR-3.4.3 (Returns Management \- RMA):** Support a formal Return Merchandise Authorization (RMA) process for handling customer returns.

### **3.5 Reporting & Analytics Dashboard**

* **FR-3.5.1 (Main Dashboard):** Display key performance indicators (KPIs) like Inventory Turnover and Sell-Through Rate on a visual dashboard.  
* **FR-3.5.2 (Standard Reports):** Provide pre-built, exportable reports such as Stock Aging, Sales History, and Supplier Performance.  
* **FR-3.5.3 (Demand Forecasting):** Include a foundational demand forecasting tool that uses historical sales data to project future demand.

## **Part 4: API Specification (Express.js)**

### **4.1 General Principles**

* **RESTful Design:** The API will adhere to REST principles, using resource-based URLs, standard HTTP methods, and stateless communication.  
* **Versioning:** All API routes will be versioned (e.g., /api/v1/).  
* **Data Format:** The API will exclusively use JSON for all request and response bodies.  
* **API Documentation:** The formal contract for the API will be defined and maintained in the openapi.yaml file within the service's directory (src/backend/inventory-service/openapi.yaml), as required by the project's contribution guidelines.  
* **Standard Responses:** The API will use standard HTTP status codes and consistent JSON response envelopes for success and error states.  
* **Pagination:** All GET requests that return large collections will be paginated using page and limit query parameters.

### **4.2 API Endpoint Specification**

The following table specifies the examples of contract for key API endpoints. This information will be used to populate the openapi.yaml file.
## TO BE UPDATED

| Resource URL | HTTP Method | Description | RBAC | Success Response (2xx) | Error Response (4xx/5xx) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| /api/v1/auth/login | POST | Authenticate a user and receive a JWT. | Public | 200 OK | 401 Unauthorized |
| /api/v1/products | GET | Retrieve a paginated list of products. | All Roles | 200 OK | 500 Internal Server Error |
| /api/v1/products | POST | Create a new master product. | System Admin | 201 Created | 400 Bad Request |
| /api/v1/products/{id} | GET | Get details of a single product, including its variants. | All Roles | 200 OK | 404 Not Found |
| /api/v1/inventory/levels | GET | Get current stock levels for variants. | Warehouse Mgr, Sales Rep | 200 OK | 400 Bad Request |
| /api/v1/inventory/transactions | POST | Create a new inventory transaction (e.g., adjustment). | Warehouse Mgr | 201 Created | 400 Bad Request |
| /api/v1/purchase-orders | POST | Create a new purchase order. | Procure. Officer | 201 Created | 400 Bad Request |
| /api/v1/purchase-orders/{id}/receive | POST | Record a goods receipt against a PO. | Warehouse Mgr | 200 OK | 400 Bad Request |
| /api/v1/sales-orders | POST | Create a new sales order. | Sales Rep | 201 Created | 400 Bad Request |
| /api/v1/reports/inventory-valuation | GET | Generate the inventory valuation report. | Finance, Warehouse Mgr | 200 OK | 400 Bad Request |