# Vinyl Catalogue Management System — DBMS Mini Project

A full-stack web application for managing a vinyl record store. It covers the complete lifecycle of a record store: cataloguing music, managing artists and record labels, handling customer memberships, processing sales and returns, tracking reservations, and providing a real-time store dashboard. The project was built as a Database Management Systems (DBMS) mini-project and demonstrates relational database design, normalisation, triggers, stored procedures, and functions backed by a REST API and a browser-based single-page interface.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [Database Design](#4-database-design)
   - [Entity Tables](#41-entity-tables)
   - [Relationship / Junction Tables](#42-relationship--junction-tables)
   - [Multi-Valued Attribute Tables](#43-multi-valued-attribute-tables)
5. [Database Automation — Triggers, Procedures & Functions](#5-database-automation--triggers-procedures--functions)
   - [Triggers](#51-triggers)
   - [Stored Procedures](#52-stored-procedures)
   - [Functions](#53-functions)
6. [Sample Data](#6-sample-data)
7. [Backend — Node.js / Express Server](#7-backend--nodejs--express-server)
   - [Environment Configuration](#71-environment-configuration)
   - [REST API Endpoints](#72-rest-api-endpoints)
8. [Frontend — Single-Page Application](#8-frontend--single-page-application)
   - [Page Layout & Tabs](#81-page-layout--tabs)
   - [JavaScript Modules](#82-javascript-modules)
9. [Setup & Running the Application](#9-setup--running-the-application)
10. [Key Design Decisions & Business Rules](#10-key-design-decisions--business-rules)

---

## 1. Project Overview

The Vinyl Catalogue Management System models a physical vinyl record store with the following capabilities:

| Domain | What the system manages |
|---|---|
| **Music Catalogue** | Vinyl records with title, genre, edition, catalog number, and copy counts |
| **Artists** | Solo artists, bands, orchestras, DJs, duos with nationality |
| **Record Labels** | Label names, addresses, and contact numbers |
| **Customers** | Full name, email, membership tier (Regular / Premium / VIP), join date, address, phone numbers, and referral chains |
| **Staff** | Employees with roles (Manager, Cashier, Sales Associate, Inventory Manager), salary, and contact numbers |
| **Transactions** | Sales and returns of records, linked to a customer and the staff member who processed them; inventory is updated automatically |
| **Reservations** | Customers can reserve specific records; availability is enforced by a trigger |
| **Dashboard** | Live overview: total records, total customers, active reservations, today's revenue, and 5 most recent transactions |

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Database | MySQL 8.0 |
| Backend | Node.js 18+, Express 5, mysql2, dotenv, cors |
| Dev tooling | nodemon |
| Frontend | Vanilla HTML / CSS / JavaScript (no framework) |
| Communication | REST JSON API over HTTP |

---

## 3. Repository Structure

```
dbms-mini-project/
│
├── README.md                              ← this file
│
│── SQL dump files (one per table + one for automation objects)
├── vinylcatalogue_record.sql              ← RECORD table + seed data
├── vinylcatalogue_artist.sql              ← ARTIST table + seed data
├── vinylcatalogue_customer.sql            ← CUSTOMER table + seed data
├── vinylcatalogue_customer_phone.sql      ← CUSTOMER_PHONE multi-valued table
├── vinylcatalogue_staff.sql               ← STAFF table + seed data
├── vinylcatalogue_staff_contact.sql       ← STAFF_CONTACT multi-valued table
├── vinylcatalogue_label.sql               ← LABEL table + seed data
├── vinylcatalogue_label_contact.sql       ← LABEL_CONTACT multi-valued table
├── vinylcatalogue_transaction.sql         ← TRANSACTION table + seed data
├── vinylcatalogue_reservation.sql         ← RESERVATION table + seed data
├── vinylcatalogue_produced_by.sql         ← PRODUCED_BY junction table
├── vinylcatalogue_distributed_by.sql      ← DISTRIBUTED_BY junction table
├── vinylcatalogue_buys.sql                ← BUYS junction table
├── vinylcatalogue_reserves.sql            ← RESERVES junction table
├── vinylcatalogue_processed_by.sql        ← PROCESSED_BY junction table
├── vinylcatalogue_refers.sql              ← REFERS self-referential table
├── vinylcatalogue_pro_trig_fun.sql        ← All triggers, stored procedures, functions
│
└── vinyl-catalogue-app/                   ← Full-stack web application
    ├── package.json
    ├── server.js                          ← Express REST API server
    ├── .env                               ← DB credentials (not committed)
    └── public/                            ← Static frontend (served by Express)
        ├── index.html                     ← Single-page app shell + all tab UIs
        ├── css/
        │   └── style.css
        └── js/
            ├── config.js                  ← API base URL constant
            ├── main.js                    ← Tab navigation + page init
            ├── dashboard.js               ← Dashboard stats + recent transactions
            ├── records.js                 ← Record CRUD + search
            ├── artists.js                 ← Artist CRUD + search
            ├── customers.js               ← Customer CRUD + search + membership filter
            ├── staff.js                   ← Staff CRUD
            ├── transactions.js            ← Transaction form + transaction list
            ├── reservations.js            ← Reservation CRUD + status update
            └── labels.js                  ← Label CRUD
```

---

## 4. Database Design

The database is named **`vinylcatalogue`** and uses MySQL InnoDB with `utf8mb4` charset. All tables use integer primary keys. Foreign key constraints enforce referential integrity throughout.

### 4.1 Entity Tables

#### `RECORD`
The central entity of the system. Tracks every vinyl record stocked by the store.

| Column | Type | Description |
|---|---|---|
| `Record_ID` | INT PK | Auto-assigned identifier |
| `Title` | VARCHAR(100) | Album / record title |
| `Genre` | VARCHAR(50) | Music genre (Rock, Jazz, Classical, Pop, Blues, Electronic, Hip-Hop, Country, Folk, Metal) |
| `Edition` | VARCHAR(50) | Pressing edition e.g. "First Press", "Deluxe", "Remastered" |
| `Catalog_Number` | VARCHAR(50) | Label-assigned catalog code |
| `Total_Copies` | INT | Total copies ever owned |
| `Available_Copies` | INT | Copies currently available for sale / reservation |

#### `ARTIST`
Represents any musical act that produced records stocked by the store.

| Column | Type | Description |
|---|---|---|
| `Artist_ID` | INT PK | |
| `Name` | VARCHAR(100) | Artist or band name |
| `Nationality` | VARCHAR(50) | Country of origin |
| `Type` | VARCHAR(50) | Solo Artist, Band, Orchestra, DJ, Duo, Group |

#### `LABEL`
Record labels that distribute records in the store's catalogue.

| Column | Type | Description |
|---|---|---|
| `Label_ID` | INT PK | |
| `Name` | VARCHAR(100) | Label name |
| `Address` | VARCHAR(200) | Registered address |

#### `CUSTOMER`
Store members who can buy or reserve records.

| Column | Type | Description |
|---|---|---|
| `Customer_ID` | INT PK | |
| `First_Name` | VARCHAR(50) | |
| `Second_Name` | VARCHAR(50) | Optional middle name |
| `Last_Name` | VARCHAR(50) | |
| `Email` | VARCHAR(100) | Validated by trigger; must match `%_@__%.__%` |
| `Membership_Type` | VARCHAR(30) | Regular, Premium, VIP (also Bronze/Silver/Gold/Platinum in seed data) |
| `Date_Of_Join` | DATE | Set to `CURDATE()` on insert via the API |
| `Street` | VARCHAR(100) | |
| `City` | VARCHAR(50) | |
| `Pincode` | VARCHAR(10) | |

#### `STAFF`
Store employees who process transactions.

| Column | Type | Description |
|---|---|---|
| `Staff_ID` | INT PK | |
| `Name` | VARCHAR(100) | |
| `Role` | VARCHAR(50) | Manager, Sales Associate, Cashier, Inventory Manager |
| `Salary` | DECIMAL(10,2) | |

#### `TRANSACTION`
A financial event — either a Sale or a Return.

| Column | Type | Description |
|---|---|---|
| `Transaction_ID` | INT PK | |
| `Transaction_Type` | VARCHAR(50) | "Sale" or "Return" |
| `Transaction_Date` | DATE | Date of transaction |
| `Unit_Price` | DECIMAL(10,2) | Price per copy |
| `Quantity` | INT | Number of copies |
| `Total_Amount` | DECIMAL(12,2) | Computed automatically (`Unit_Price × Quantity`) via trigger |

#### `RESERVATION`
Represents a customer's intent to hold a record.

| Column | Type | Description |
|---|---|---|
| `Reservation_ID` | INT PK | |
| `Reservation_Date` | DATE | Date created |
| `Status` | VARCHAR(20) | "Active", "Pending", or "Completed" |

---

### 4.2 Relationship / Junction Tables

These tables encode many-to-many relationships between entity tables.

| Table | Columns | Relationship |
|---|---|---|
| `PRODUCED_BY` | `Record_ID` → RECORD, `Artist_ID` → ARTIST | A record is produced by one or more artists |
| `DISTRIBUTED_BY` | `Record_ID` → RECORD, `Label_ID` → LABEL | A record is distributed by one or more labels |
| `BUYS` | `Customer_ID` → CUSTOMER, `Record_ID` → RECORD, `Transaction_ID` → TRANSACTION | Links a purchase/return event to a customer and a record |
| `RESERVES` | `Customer_ID` → CUSTOMER, `Record_ID` → RECORD, `Reservation_ID` → RESERVATION | Links a reservation to a customer and a record |
| `PROCESSED_BY` | `Transaction_ID` → TRANSACTION, `Staff_ID` → STAFF | Records which staff member handled a transaction (one-to-one on Transaction_ID) |
| `REFERS` | `Referrer_ID` → CUSTOMER, `Referred_ID` → CUSTOMER | Self-referential: tracks customer referral chains |

---

### 4.3 Multi-Valued Attribute Tables

Phone/contact numbers are modelled as separate tables (1NF compliance — each entity can have multiple contact numbers).

| Table | Columns | Parent |
|---|---|---|
| `CUSTOMER_PHONE` | `Customer_ID`, `Phone_No` (VARCHAR 15) | CUSTOMER |
| `STAFF_CONTACT` | `Staff_ID`, `Contact_No` (VARCHAR 15) | STAFF |
| `LABEL_CONTACT` | `Label_ID`, `Contact_No` (VARCHAR 15) | LABEL |

---

## 5. Database Automation — Triggers, Procedures & Functions

All automation objects are defined in **`vinylcatalogue_pro_trig_fun.sql`**.

### 5.1 Triggers

| # | Name | Event | Table | What it does |
|---|---|---|---|---|
| 1 | `after_purchase_insert` | AFTER INSERT | `BUYS` | Reads the quantity from the linked TRANSACTION row and decrements `RECORD.Available_Copies` accordingly |
| 2 | `before_reservation_insert` | BEFORE INSERT | `RESERVES` | Reads `RECORD.Available_Copies`; raises `SQLSTATE 45000` with message _"Cannot reserve: No copies available"_ if `available <= 0` |
| 3 | `after_purchase_update_reservation` | AFTER INSERT | `BUYS` | When a purchase is made, sets Status = `'Completed'` on any `RESERVATION` row that has `Status = 'Pending'` for the same customer/record combination |
| 4 | `before_transaction_insert` | BEFORE INSERT | `TRANSACTION` | Auto-calculates `Total_Amount = Unit_Price × Quantity` |
| 5 | `before_customer_insert_validate` | BEFORE INSERT | `CUSTOMER` | Validates email format using LIKE `'%_@__%.__%'`; raises `SQLSTATE 45000` with message _"Invalid email format"_ on failure |

> **Note:** Trigger 1 (`after_purchase_insert`) and the application-level inventory update in `server.js` both modify `Available_Copies`. When using the web application, the server performs an explicit `UPDATE RECORD SET Available_Copies = ?` after the transaction, which means the trigger fires on the BUYS insert as well. This is a known design overlap in the current implementation.

### 5.2 Stored Procedures

| Procedure | Parameters | Description |
|---|---|---|
| `ProcessPurchase` | `p_customer_id`, `p_record_id`, `p_transaction_id`, `p_quantity`, `p_unit_price`, `p_staff_id` | Checks availability, inserts a TRANSACTION row, links it via PROCESSED_BY and BUYS. Raises SQLSTATE 45000 if insufficient copies. |
| `GetCustomerPurchaseHistory` | `p_customer_id` | Returns all transactions for a customer: Transaction_ID, date, Record_Title, Genre, Quantity, Unit_Price, Total_Amount, ordered by date DESC. |
| `RestockRecord` | `p_record_id`, `p_additional_copies` | Increments both `Total_Copies` and `Available_Copies` by the given amount and returns a confirmation message. |

### 5.3 Functions

| Function | Parameter | Returns | Description |
|---|---|---|---|
| `GetCustomerTotalSpending` | `p_customer_id INT` | `DECIMAL(12,2)` | Sums `Total_Amount` from all TRANSACTION rows linked to a customer via BUYS. Returns `0` if no purchases. |
| `IsRecordAvailable` | `p_record_id INT` | `BOOLEAN` | Returns `TRUE` if `Available_Copies > 0`, otherwise `FALSE`. |

---

## 6. Sample Data

Each SQL dump includes seed rows. The key seed data across tables:

- **17 records** — classic albums (In Rainbows, Abbey Road, Thriller, etc.) plus fictional indie/synthwave records
- **15 artists** — well-known acts (Radiohead, The Beatles, Daft Punk, etc.) plus fictional artists (The Neon Echoes, Luna Skye, DJ Groovemaster, etc.)
- **13 labels** — real labels (XL Recordings, EMI, Epic, Columbia, etc.) and fictional ones (Future Sounds Records, Vintage Wax, Global Beats)
- **16 customers** — across US cities with various membership tiers
- **13 staff members** — various roles and salary levels
- **20 transactions** — mix of purchases across 2024–2025
- **16 reservations** — mix of Pending, Completed statuses
- Full junction table rows wiring everything together

---

## 7. Backend — Node.js / Express Server

**Entry point:** `vinyl-catalogue-app/server.js`

The server:
- Connects to MySQL using the `mysql2` package with credentials from `.env`
- Serves the static frontend from `public/`
- Exposes a JSON REST API under `/api/`
- Uses database transactions (`db.beginTransaction` / `db.commit` / `db.rollback`) for all multi-step write operations to ensure atomicity

### 7.1 Environment Configuration

Create `vinyl-catalogue-app/.env` with:

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=vinylcatalogue
SERVER_PORT=3000
```

### 7.2 REST API Endpoints

#### Records — `/api/records`

| Method | Path | Description |
|---|---|---|
| GET | `/api/records` | Returns all records ordered by Record_ID DESC |
| POST | `/api/records` | Inserts a new record. Body: `{ title, genre, edition, catalog_number, total_copies, available_copies }` |
| DELETE | `/api/records/:id` | Deletes a record inside a transaction; first clears PRODUCED_BY, DISTRIBUTED_BY, BUYS, RESERVES rows that reference this record |

#### Artists — `/api/artists`

| Method | Path | Description |
|---|---|---|
| GET | `/api/artists` | Returns all artists ordered by Artist_ID DESC |
| POST | `/api/artists` | Inserts a new artist. Body: `{ name, nationality, type }` |
| DELETE | `/api/artists/:id` | Deletes an artist only if no PRODUCED_BY rows reference them; returns 400 otherwise |

#### Customers — `/api/customers`

| Method | Path | Description |
|---|---|---|
| GET | `/api/customers` | Returns all customers ordered by Customer_ID DESC |
| POST | `/api/customers` | Inserts a new customer and optionally a CUSTOMER_PHONE row inside a transaction. Body: `{ first_name, second_name, last_name, email, membership_type, street, city, pincode, phone }` |

#### Staff — `/api/staff`

| Method | Path | Description |
|---|---|---|
| GET | `/api/staff` | Returns all staff ordered by Staff_ID DESC |
| POST | `/api/staff` | Inserts a new staff member and optionally a STAFF_CONTACT row. Body: `{ name, role, salary, contact }` |

#### Transactions — `/api/transactions`

| Method | Path | Description |
|---|---|---|
| GET | `/api/transactions` | Returns the 50 most recent transactions joined with customer name, record title, and staff name |
| POST | `/api/transactions` | Processes a sale or return. Validates available stock for Sales; inserts into TRANSACTION, BUYS, PROCESSED_BY; updates Available_Copies. Body: `{ customer_id, record_id, staff_id, quantity, unit_price, transaction_type }` |

#### Reservations — `/api/reservations`

| Method | Path | Description |
|---|---|---|
| GET | `/api/reservations` | Returns all reservations joined with customer name and record title |
| POST | `/api/reservations` | Creates a RESERVATION and a RESERVES link inside a transaction. Body: `{ customer_id, record_id }` |
| PUT | `/api/reservations/:id` | Updates reservation Status. Body: `{ status }` |
| DELETE | `/api/reservations/:id` | Deletes RESERVES link then RESERVATION row inside a transaction |

#### Labels — `/api/labels`

| Method | Path | Description |
|---|---|---|
| GET | `/api/labels` | Returns all labels ordered by Label_ID DESC |
| POST | `/api/labels` | Inserts a new label. Body: `{ name, address }` |
| DELETE | `/api/labels/:id` | Deletes a label by Label_ID |

#### Dashboard — `/api/stats`

| Method | Path | Description |
|---|---|---|
| GET | `/api/stats` | Returns `{ totalRecords, totalCustomers, activeReservations, todaySales, recentTransactions[] }`. todaySales is the sum of Total_Amount for transactions dated today. recentTransactions is the 5 most recent transaction rows joined to customer and record. |

#### Health Check

| Method | Path | Description |
|---|---|---|
| GET | `/api/test` | Returns `{ message: "Server is running!" }` |

---

## 8. Frontend — Single-Page Application

The frontend is a single HTML file (`public/index.html`) with a dark Spotify-inspired theme (background `#121212`, containers `#1E1E1E`, accent colour `#667eea` / `#764ba2`). Tab switching is handled purely in JavaScript with no page reloads.

### 8.1 Page Layout & Tabs

The page header contains the store title. Below it is a tab navigation bar with eight tabs. Only one tab content div is visible at a time (`display: block` vs `display: none`).

| Tab | What it shows |
|---|---|
| **Dashboard** | 4 stat cards (total records, total customers, active reservations, today's sales) + a recent transactions table fetched from `/api/stats` |
| **Records** | Search bar (by title/genre), add-record form (title, artist dropdown, genre, edition, catalog number, total copies, available copies), full records table with delete button |
| **Artists** | Search bar (by name), add-artist form (name, nationality, type), artists table with delete button |
| **Customers** | Search bar (by name/email) + membership type filter dropdown, add-customer form (full name, email, membership, phone, address), customers table |
| **Transactions** | Sell/return form (customer dropdown, record dropdown, staff dropdown, quantity, unit price, transaction type), recent transactions table |
| **Reservations** | Add-reservation form (customer dropdown, record dropdown), reservations table with status-update and delete buttons |
| **Labels** | Add-label form (name, address), labels table with delete button |
| **Staff** | Add-staff form (name, role, salary, contact number), staff table |

### 8.2 JavaScript Modules

All scripts are loaded at the bottom of `index.html`. `config.js` is loaded first, establishing `API_URL = 'http://localhost:3000/api'`, which all other modules reference.

| File | Responsibility |
|---|---|
| `config.js` | Exports `API_URL` used by all other modules |
| `main.js` | Implements `showTab(tabName, btn)` for tab switching; calls all `load*()` functions on page load to populate dropdowns and tables |
| `dashboard.js` | `loadDashboard()` — fetches `/api/stats` and renders stat cards and a recent-transactions HTML table |
| `records.js` | `loadRecords()`, `searchRecords()`, `deleteRecord(id)` — handles the records form submit, renders a sortable HTML table |
| `artists.js` | `loadArtists()`, `searchArtists()`, `deleteArtist(id)` — similar pattern; also populates the Artist dropdown in the Records tab |
| `customers.js` | `loadCustomers()`, `searchCustomers()` — handles name/email text search and membership-type filter; populates Customer dropdowns in Transactions and Reservations |
| `staff.js` | `loadStaff()` — handles form submit; populates Staff dropdown in Transactions |
| `transactions.js` | `loadTransactions()` — handles the transaction form (sale/return) and renders the transaction list; populates Record dropdown |
| `reservations.js` | `loadReservations()`, `addReservation()`, `updateReservationStatus(id, status)`, `deleteReservation(id)` |
| `labels.js` | `loadLabels()`, `deleteLabel(id)` |

---

## 9. Setup & Running the Application

### Prerequisites
- MySQL 8.0+
- Node.js 18+

### Step 1 — Create and populate the database

```sql
CREATE DATABASE vinylcatalogue;
USE vinylcatalogue;
```

Import the SQL files in dependency order (entities before junction tables):

```bash
mysql -u root -p vinylcatalogue < vinylcatalogue_record.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_artist.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_label.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_customer.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_staff.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_transaction.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_reservation.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_customer_phone.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_staff_contact.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_label_contact.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_produced_by.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_distributed_by.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_buys.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_reserves.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_processed_by.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_refers.sql
mysql -u root -p vinylcatalogue < vinylcatalogue_pro_trig_fun.sql
```

### Step 2 — Configure environment

```bash
cd vinyl-catalogue-app
cp .env.example .env   # or create .env manually
```

Edit `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=vinylcatalogue
SERVER_PORT=3000
```

### Step 3 — Install dependencies

```bash
cd vinyl-catalogue-app
npm install
```

### Step 4 — Start the server

```bash
# Production
npm start

# Development (auto-restarts on file change)
npm run dev
```

### Step 5 — Open the application

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 10. Key Design Decisions & Business Rules

1. **Referential integrity is enforced entirely in the database.** Every junction table carries foreign key constraints. Cascade behaviour is not used; the application-layer delete endpoints manually remove child rows before deleting a parent.

2. **Phone numbers are multi-valued attributes stored in separate tables** (`CUSTOMER_PHONE`, `STAFF_CONTACT`, `LABEL_CONTACT`), achieving First Normal Form.

3. **Transaction totals are auto-calculated** by `before_transaction_insert` trigger (`Total_Amount = Unit_Price × Quantity`), ensuring consistency regardless of how rows are inserted.

4. **Email validation** is enforced at the database level by `before_customer_insert_validate`. The API surfaces the trigger's error message directly to the client (HTTP 400 with the trigger message).

5. **Reservation availability** is enforced by the `before_reservation_insert` trigger — a customer cannot reserve a record with zero available copies.

6. **Inventory is decremented** both by the `after_purchase_insert` trigger (fired when a BUYS row is inserted) and by an explicit `UPDATE RECORD` in the API's transaction handler. The double-decrement is a known limitation of the current implementation.

7. **Customer referrals** are tracked in the `REFERS` table as a self-referential many-to-many relationship between customers, allowing the store to model referral chains (who brought in whom).

8. **All multi-step write operations in the API use explicit MySQL transactions** (`beginTransaction` / `commit` / `rollback`) to maintain atomicity — for example, creating a customer and their phone number, or processing a sale and updating inventory.

9. **Artist deletion is guarded**: an artist cannot be deleted if they appear in `PRODUCED_BY`, preventing orphaned catalogue entries.
