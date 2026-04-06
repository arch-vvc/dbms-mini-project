# Vinyl Catalogue Management System — DBMS Mini Project

A full-stack web application for managing a vinyl record store. It covers the complete lifecycle of a record store: cataloguing music, managing artists and record labels, handling customer memberships, processing sales and returns, tracking reservations, and providing a real-time store dashboard. The project was built as a Database Management Systems (DBMS) mini-project and demonstrates relational database design, normalisation, triggers, stored procedures, and functions backed by a REST API and a browser-based single-page interface.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure](#3-repository-structure)
4. [SQL Files — Detailed Walkthrough](#4-sql-files--detailed-walkthrough)
   - [Entity Table Files](#41-entity-table-files)
   - [Multi-Valued Attribute Table Files](#42-multi-valued-attribute-table-files)
   - [Junction / Relationship Table Files](#43-junction--relationship-table-files)
   - [Automation File](#44-automation-file)
5. [Database Design Summary](#5-database-design-summary)
   - [Entity Tables](#51-entity-tables)
   - [Relationship / Junction Tables](#52-relationship--junction-tables)
   - [Multi-Valued Attribute Tables](#53-multi-valued-attribute-tables)
6. [Database Automation — Triggers, Procedures & Functions](#6-database-automation--triggers-procedures--functions)
   - [Triggers](#61-triggers)
   - [Stored Procedures](#62-stored-procedures)
   - [Functions](#63-functions)
7. [Sample Data](#7-sample-data)
8. [Backend — Node.js / Express Server](#8-backend--nodejs--express-server)
   - [Environment Configuration](#81-environment-configuration)
   - [REST API Endpoints](#82-rest-api-endpoints)
9. [Frontend — Single-Page Application](#9-frontend--single-page-application)
   - [Visual Design & CSS](#91-visual-design--css)
   - [Tab Navigation & Initialisation](#92-tab-navigation--initialisation)
   - [Dashboard Tab](#93-dashboard-tab)
   - [Records Tab](#94-records-tab)
   - [Artists Tab](#95-artists-tab)
   - [Customers Tab](#96-customers-tab)
   - [Transactions Tab](#97-transactions-tab)
   - [Reservations Tab](#98-reservations-tab)
   - [Labels Tab](#99-labels-tab)
   - [Staff Tab](#910-staff-tab)
   - [JavaScript Module Reference](#911-javascript-module-reference)
10. [Setup & Running the Application](#10-setup--running-the-application)
11. [Key Design Decisions & Business Rules](#11-key-design-decisions--business-rules)

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
├── README.md
│
│── SQL dump files (one per table + one for automation objects)
├── vinylcatalogue_record.sql
├── vinylcatalogue_artist.sql
├── vinylcatalogue_customer.sql
├── vinylcatalogue_customer_phone.sql
├── vinylcatalogue_staff.sql
├── vinylcatalogue_staff_contact.sql
├── vinylcatalogue_label.sql
├── vinylcatalogue_label_contact.sql
├── vinylcatalogue_transaction.sql
├── vinylcatalogue_reservation.sql
├── vinylcatalogue_produced_by.sql
├── vinylcatalogue_distributed_by.sql
├── vinylcatalogue_buys.sql
├── vinylcatalogue_reserves.sql
├── vinylcatalogue_processed_by.sql
├── vinylcatalogue_refers.sql
├── vinylcatalogue_pro_trig_fun.sql
│
└── vinyl-catalogue-app/
    ├── package.json
    ├── server.js
    ├── .env
    └── public/
        ├── index.html
        ├── css/
        │   └── style.css
        └── js/
            ├── config.js
            ├── main.js
            ├── dashboard.js
            ├── records.js
            ├── artists.js
            ├── customers.js
            ├── staff.js
            ├── transactions.js
            ├── reservations.js
            └── labels.js
```

---

## 4. SQL Files — Detailed Walkthrough

All SQL files are MySQL 8.0 dumps generated with `mysqldump`. Each file drops and recreates its table, then inserts seed rows. They need to be imported in the dependency order shown in the [Setup section](#10-setup--running-the-application) because junction tables reference entity tables via foreign keys.

### 4.1 Entity Table Files

**`vinylcatalogue_record.sql`**
Defines and seeds the `RECORD` table, which is the core catalogue entity. It creates seven columns: `Record_ID` (INT primary key), `Title`, `Genre`, `Edition`, `Catalog_Number`, `Total_Copies`, and `Available_Copies`. The seed data contains 17 rows split between classic real-world albums (In Rainbows by Radiohead, Abbey Road by The Beatles, Thriller by Michael Jackson, Nevermind by Nirvana, 1989 by Taylor Swift, etc.) and fictional releases like "Electric Dreams" (Synthwave, Limited edition) and "Café Au Lait" (Jazz, Deluxe). The `Available_Copies` values are lower than `Total_Copies` on several rows to simulate copies already sold — for example Abbey Road shows 0 available out of 15 total.

**`vinylcatalogue_artist.sql`**
Defines and seeds the `ARTIST` table with four columns: `Artist_ID`, `Name`, `Nationality`, and `Type`. The `Type` column uses free-form text values including Solo, Band, Duo, Orchestra, Group, and DJ. The 15 seeded rows include well-known acts (Radiohead, The Beatles, Daft Punk, Fleetwood Mac, Amy Winehouse, Nirvana, Coldplay, etc.) alongside fictional artists created to pair with the fictional records (The Neon Echoes, Luna Skye, DJ Groovemaster, Misty Road, Jazz Ensemble 7).

**`vinylcatalogue_label.sql`**
Defines and seeds the `LABEL` table with three columns: `Label_ID`, `Name`, and `Address`. The 13 seeded rows include real industry labels (XL Recordings, EMI Records, Epic Records, Columbia Records, Top Dawg Entertainment, Warner Bros., Island Records, Parlophone, Geffen, Republic) alongside the three fictional labels matched to the fictional records: Future Sounds Records (Los Angeles), Vintage Wax (London), and Global Beats (Berlin).

**`vinylcatalogue_customer.sql`**
Defines and seeds the `CUSTOMER` table with ten columns covering full name (first, optional middle, last), email, membership tier, join date, and address fields (street, city, pincode). The 16 seeded customers span two ID ranges: IDs 1–11 are an initial set with US city addresses (New York, Boston, Seattle, Austin, Chicago, Denver, Miami, LA, Dallas, San Diego) and membership tiers like Gold, Silver, Bronze, and Platinum; IDs 501–505 are a second batch using different naming conventions (Sarah Connor, Mark Ruffalo, Emily Wong, etc.). The `Date_Of_Join` values range from January 2023 through January 2025.

**`vinylcatalogue_staff.sql`**
Defines and seeds the `STAFF` table with four columns: `Staff_ID`, `Name`, `Role`, and `Salary`. The 13 seeded employees are spread across two ID ranges: IDs 1–10 have roles like Cashier, Manager, Assistant, Sales, and Inventory with salaries from $40,000 to $72,000; IDs 401–403 use more formal role titles (Sales Associate, Inventory Specialist) and were added in a second batch. The salary column uses `DECIMAL(10,2)`, allowing for precise dollar amounts.

**`vinylcatalogue_transaction.sql`**
Defines and seeds the `TRANSACTION` table with six columns: `Transaction_ID`, `Transaction_Type`, `Transaction_Date`, `Unit_Price`, `Quantity`, and `Total_Amount`. All 20 seeded rows are typed as "Purchase" (not "Return"), giving a realistic baseline of sales history spanning January 2024 through October 2025. The `Total_Amount` values are pre-computed in the seed data; on live inserts the `before_transaction_insert` trigger handles this automatically. Unit prices range from $25 to $800, reflecting the wide price range of vinyl records from recent pressings to vintage collector items.

**`vinylcatalogue_reservation.sql`**
Defines and seeds the `RESERVATION` table with three columns: `Reservation_ID`, `Reservation_Date`, and `Status`. The 16 seeded reservations span two date ranges (2024 and October 2025) with a mix of "Pending" and "Completed" statuses. There are no "Active" or "Cancelled" rows in the seed data, though the application supports those states. The `Status` field is a free-form VARCHAR(20), so any string value is accepted at the database level.

### 4.2 Multi-Valued Attribute Table Files

**`vinylcatalogue_customer_phone.sql`**
Defines the `CUSTOMER_PHONE` table, which stores phone numbers for customers as a separate table rather than a column on CUSTOMER — the standard 1NF approach for attributes that can have multiple values per entity. The primary key is a composite of `(Customer_ID, Phone_No)`, meaning one customer can have multiple phone numbers. The file seeds 15 rows, one per customer, using two format styles: 10-digit numeric strings (e.g. `9990001111`) for the first 10 customers and hyphenated formats (e.g. `555-0001`) for the 501–505 batch.

**`vinylcatalogue_staff_contact.sql`**
Defines the `STAFF_CONTACT` table on the same pattern as CUSTOMER_PHONE. The composite primary key is `(Staff_ID, Contact_No)`. It seeds 13 rows, one per staff member, again with two number formats: 10-digit strings for IDs 1–10 and hyphenated for IDs 401–403.

**`vinylcatalogue_label_contact.sql`**
Defines the `LABEL_CONTACT` table for record label contact numbers, using the same composite primary key pattern `(Label_ID, Contact_No)`. It seeds 13 rows: 6-digit numeric strings (e.g. `777001`) for the 10 real-world labels and hyphenated numbers for the three fictional labels.

### 4.3 Junction / Relationship Table Files

**`vinylcatalogue_produced_by.sql`**
Defines the `PRODUCED_BY` table, which is a many-to-many junction between RECORD and ARTIST. The composite primary key is `(Record_ID, Artist_ID)`. Both columns are also foreign keys referencing their parent tables. The 15 seeded rows link each real-world record to its corresponding artist (e.g. Record 1 → Radiohead, Record 2 → The Beatles) and each fictional record to its fictional artist (e.g. Record 301 → The Neon Echoes). Notably, Radiohead is linked to both Record 1 (In Rainbows) and Record 8 (OK Computer), demonstrating the many-to-many capability.

**`vinylcatalogue_distributed_by.sql`**
Defines the `DISTRIBUTED_BY` junction table between RECORD and LABEL, again with a `(Record_ID, Label_ID)` composite primary key and FK constraints on both sides. The 15 seeded rows wire each record to one label. The fictional records split across two labels: Future Sounds Records handles Records 301 and 305; Vintage Wax handles 302 and 304; Global Beats handles 303.

**`vinylcatalogue_buys.sql`**
Defines the `BUYS` table, which is a three-way junction connecting CUSTOMER, RECORD, and TRANSACTION. The composite primary key spans all three columns `(Customer_ID, Record_ID, Transaction_ID)`, with individual FK constraints on each. This structure means a single TRANSACTION row represents one line-item of a particular record bought by a particular customer. The 20 seeded rows map the existing transactions to their customers and records — for example Customer 3 (Alice Brown) has purchased Record 3 three times (Transaction_IDs 3, 302, and 303), showing that the same customer-record pair can appear multiple times with different transaction IDs.

**`vinylcatalogue_reserves.sql`**
Defines the `RESERVES` junction table linking CUSTOMER, RECORD, and RESERVATION together. The composite primary key is `(Customer_ID, Record_ID, Reservation_ID)` with FK constraints on all three. The 16 seeded rows include an interesting pattern where Customer 3 has three separate reservation rows all pointing to Record 3 (three different Reservation_IDs: 501, 503, 504), reflecting repeat reservation attempts or a history of reservations for the same item.

**`vinylcatalogue_processed_by.sql`**
Defines the `PROCESSED_BY` table, which links each TRANSACTION to the STAFF member who handled it. Unlike the other junction tables, the primary key here is just `Transaction_ID` (not composite), making this effectively a one-to-one extension of TRANSACTION — each transaction is processed by exactly one staff member. The FK on `Staff_ID` is a regular index, not part of the PK. The 17 seeded rows cover all seeded transactions, with Transactions 20 and 201 both processed by Staff 1, and the 401–403 batch of staff handling Transactions 701–705.

**`vinylcatalogue_refers.sql`**
Defines the self-referential `REFERS` table, where both columns (`Referrer_ID` and `Referred_ID`) are foreign keys pointing back to the `CUSTOMER` table. The composite `(Referrer_ID, Referred_ID)` primary key prevents duplicate referral records. The 11 seeded rows form a chain: Customer 10 referred Customer 1, Customer 1 referred Customer 2, Customer 2 referred Customer 3, and so on up to Customer 9 referring Customer 10, completing a referral cycle among the first 10 customers. Customer 501 also referred Customer 502.

### 4.4 Automation File

**`vinylcatalogue_pro_trig_fun.sql`**
This is the only file that does not use the `mysqldump` format — it is a hand-written SQL script containing all database automation objects. It defines five `DELIMITER //` ... `DELIMITER ;` blocks for triggers, three stored procedures, and two functions. These must be imported last, after all tables exist, since triggers and procedures reference those tables. See [Section 6](#6-database-automation--triggers-procedures--functions) for the full breakdown of each object.

---

## 5. Database Design Summary

The database is named **`vinylcatalogue`** and uses MySQL InnoDB with `utf8mb4` charset. All tables use integer primary keys. Foreign key constraints enforce referential integrity throughout.

### 5.1 Entity Tables

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

### 5.2 Relationship / Junction Tables

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

### 5.3 Multi-Valued Attribute Tables

Phone/contact numbers are modelled as separate tables (1NF compliance — each entity can have multiple contact numbers).

| Table | Columns | Parent |
|---|---|---|
| `CUSTOMER_PHONE` | `Customer_ID`, `Phone_No` (VARCHAR 15) | CUSTOMER |
| `STAFF_CONTACT` | `Staff_ID`, `Contact_No` (VARCHAR 15) | STAFF |
| `LABEL_CONTACT` | `Label_ID`, `Contact_No` (VARCHAR 15) | LABEL |

---

## 6. Database Automation — Triggers, Procedures & Functions

All automation objects are defined in **`vinylcatalogue_pro_trig_fun.sql`**.

### 6.1 Triggers

| # | Name | Event | Table | What it does |
|---|---|---|---|---|
| 1 | `after_purchase_insert` | AFTER INSERT | `BUYS` | Reads the quantity from the linked TRANSACTION row and decrements `RECORD.Available_Copies` accordingly |
| 2 | `before_reservation_insert` | BEFORE INSERT | `RESERVES` | Reads `RECORD.Available_Copies`; raises `SQLSTATE 45000` with message _"Cannot reserve: No copies available"_ if `available <= 0` |
| 3 | `after_purchase_update_reservation` | AFTER INSERT | `BUYS` | When a purchase is made, sets Status = `'Completed'` on any `RESERVATION` row that has `Status = 'Pending'` for the same customer/record combination |
| 4 | `before_transaction_insert` | BEFORE INSERT | `TRANSACTION` | Auto-calculates `Total_Amount = Unit_Price × Quantity` |
| 5 | `before_customer_insert_validate` | BEFORE INSERT | `CUSTOMER` | Validates email format using LIKE `'%_@__%.__%'`; raises `SQLSTATE 45000` with message _"Invalid email format"_ on failure |

> **Note:** Trigger 1 (`after_purchase_insert`) and the application-level inventory update in `server.js` both modify `Available_Copies`. When using the web application, the server performs an explicit `UPDATE RECORD SET Available_Copies = ?` after the transaction, which means the trigger fires on the BUYS insert as well. This is a known design overlap in the current implementation.

### 6.2 Stored Procedures

| Procedure | Parameters | Description |
|---|---|---|
| `ProcessPurchase` | `p_customer_id`, `p_record_id`, `p_transaction_id`, `p_quantity`, `p_unit_price`, `p_staff_id` | Checks availability, inserts a TRANSACTION row, links it via PROCESSED_BY and BUYS. Raises SQLSTATE 45000 if insufficient copies. |
| `GetCustomerPurchaseHistory` | `p_customer_id` | Returns all transactions for a customer: Transaction_ID, date, Record_Title, Genre, Quantity, Unit_Price, Total_Amount, ordered by date DESC. |
| `RestockRecord` | `p_record_id`, `p_additional_copies` | Increments both `Total_Copies` and `Available_Copies` by the given amount and returns a confirmation message. |

### 6.3 Functions

| Function | Parameter | Returns | Description |
|---|---|---|---|
| `GetCustomerTotalSpending` | `p_customer_id INT` | `DECIMAL(12,2)` | Sums `Total_Amount` from all TRANSACTION rows linked to a customer via BUYS. Returns `0` if no purchases. |
| `IsRecordAvailable` | `p_record_id INT` | `BOOLEAN` | Returns `TRUE` if `Available_Copies > 0`, otherwise `FALSE`. |

---

## 7. Sample Data

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

## 8. Backend — Node.js / Express Server

**Entry point:** `vinyl-catalogue-app/server.js`

The server:
- Connects to MySQL using the `mysql2` package with credentials from `.env`
- Serves the static frontend from `public/`
- Exposes a JSON REST API under `/api/`
- Uses database transactions (`db.beginTransaction` / `db.commit` / `db.rollback`) for all multi-step write operations to ensure atomicity

### 8.1 Environment Configuration

Create `vinyl-catalogue-app/.env` with:

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=vinylcatalogue
SERVER_PORT=3000
```

### 8.2 REST API Endpoints

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

## 9. Frontend — Single-Page Application

The entire UI lives in a single HTML file (`public/index.html`). All tab content divs exist in the DOM simultaneously; `main.js` simply toggles which one is visible. Data is fetched live from the API on every tab switch, so the page always reflects the current database state without needing a reload.

### 9.1 Visual Design & CSS

The app has two CSS sources that work together. The inline `<style>` block inside `index.html` defines the core layout (header, tab nav bar, content panels, form grids, tables, and button colours). The external `public/css/style.css` extends and overrides some of those styles with more refined rules.

**Colour palette:**
- Page background: `#121212` (near-black, matching Spotify's dark theme)
- Header and container backgrounds: `#1E1E1E` / `#1a1a1a` / `#1b1b1b` (slightly lighter dark)
- Input backgrounds: `#2a2a2a` (dark charcoal)
- Active tab accent (inline styles): `#667eea` (soft blue-purple)
- Active tab accent (style.css): `#FF2D55` (Apple-style red-pink), with a left border indicator
- Hover accent: `#764ba2` (purple, inline) / `#ff476d` (lighter pink, style.css)
- Delete button: `#f44336` / `#d9534f` red variants
- Default text: `#E0E0E0` / `#f1f1f1`
- Label text: `#B3B3B3` / `#ccc` (muted gray)

**Layout:**
The page uses a top header bar followed by a horizontal tab navigation bar (defined in `index.html`). The `style.css` file provides an alternative sidebar-style layout (`nav` element, 220px wide, left-pinned) with smooth `opacity + translateY` entrance animations on `.tab-content.active`. It also adds `scroll-snap-type: y proximity` on the main content area for smooth scrolling between sections, with each `.page-section` set to `min-height: 100vh`.

**Tables:**
All data tables share a consistent style: `border-collapse: collapse`, dark `#2a2a2a` headers with white text, alternating `#181818` even rows, and a subtle `rgba(255,255,255,0.05)` hover highlight. Borders are `#404040` (dark gray).

**Badges:**
`style.css` defines `.badge` classes for reservation status display: `.badge.active` (green `#28a745`), `.badge.completed` (gray `#666`), and `.badge.cancelled` (red `#c0392b`).

**Forms:**
All forms are wrapped in a dark `#1a1a1a` card with a `border-radius: 10px` and use a `form-grid` CSS Grid layout (`repeat(auto-fit, minmax(250px, 1fr))`) so fields automatically wrap across multiple columns on wider screens.

---

### 9.2 Tab Navigation & Initialisation

**`main.js`** owns the tab-switching logic. The `showTab(tabName, clickedButton)` function:
1. Removes the `active` class from all `.tab-content` divs and all `.tab-button` elements
2. Adds `active` to the target div and to the clicked button
3. Calls the corresponding `load*()` function for that tab (e.g. `loadRecords()`, `loadArtists()`)

On `DOMContentLoaded`, `main.js` reads the `onclick` attribute of whichever tab button already has the `active` class in the HTML (which is the Dashboard button) and calls `loadDashboardStats()` to populate the page immediately on first load.

---

### 9.3 Dashboard Tab

**Script:** `dashboard.js` — `loadDashboardStats()`

When the Dashboard tab is active, `loadDashboardStats()` fires a single GET request to `/api/stats`. The server responds with an object containing `totalRecords`, `totalCustomers`, `activeReservations`, `todaySales`, and `recentTransactions`. The function:
- Writes the four stat values into the four `.stat-card` `<h3>` elements: **Total Records**, **Total Customers**, **Active Reservations**, and **Today's Sales** (formatted with a dollar sign and two decimal places)
- Calls `displayRecentTransactions(stats.recentTransactions)` which builds an HTML `<table>` with columns **ID**, **Date**, **Customer**, **Record**, **Type**, and **Total ($)**, inserting it into the `#recentTransactions` div

The stat cards use a purple-to-grape gradient background (`linear-gradient(135deg, #667eea, #764ba2)`) making them visually distinctive against the dark background. If no transactions exist yet, the table area shows "No transactions yet today."

---

### 9.4 Records Tab

**Script:** `records.js`

The Records tab has three interactive areas:

**Search bar:** A text input (`#searchRecord`) and two buttons — "Search" (calls `searchRecords()`) and "Clear" (calls `loadRecords()` to reset). `searchRecords()` fetches all records, then filters client-side by matching the search term against the Title, Genre, artist name list, or Catalog_Number fields (case-insensitive). Note: it calls `/api/records-with-artists` for search, while the initial load uses `/api/records`.

**Add Record form:** Eight fields arranged in the CSS grid:
- Title (text, required)
- Artist (dropdown, populated by fetching `/api/artists`; optional — selecting one will call `POST /api/records/:id/artists/:artistId` after the record is created to insert a PRODUCED_BY row)
- Genre (dropdown with 10 options: Rock, Jazz, Classical, Pop, Blues, Electronic, Hip-Hop, Country, Folk, Metal; required)
- Edition (text, placeholder "e.g., First Press, Remaster")
- Catalog Number (text)
- Total Copies (number, min 0, required)
- Available Copies (number, min 0, required)
- Submit button "Add Record"

On submit, the form POSTs to `/api/records`, then optionally POSTs the artist link, shows a success alert, resets the form, and refreshes the table.

**Records table:** Columns are **ID**, **Title**, **Genre**, **Edition**, **Catalog #**, **Total**, **Available**, and **Actions**. The Actions column contains a red "Delete" button that calls `deleteRecord(id, title)`. This function shows a confirmation dialog warning that all related reservations and purchases will also be removed, then calls `DELETE /api/records/:id` which cascades through PRODUCED_BY, DISTRIBUTED_BY, BUYS, and RESERVES before deleting the record itself.

---

### 9.5 Artists Tab

**Script:** `artists.js`

The Artists tab follows the same three-area layout as Records.

**Search bar:** Filters the artist list client-side by name (case-insensitive substring match). The "Clear" button reloads all artists.

**Add Artist form:** Three fields — Artist Name (text, required), Nationality (text), and Type (dropdown: Solo Artist, Band, Orchestra, DJ, Duo; required). On submit it POSTs to `/api/artists`, shows an alert, resets, and refreshes the table.

**Artists table:** Columns are **ID**, **Name**, **Nationality**, **Type**, and **Actions** (Delete button). The delete action calls `deleteArtist(id, name)`, which asks for confirmation and then calls `DELETE /api/artists/:id`. The server first checks whether any PRODUCED_BY rows reference that artist — if they do, it returns HTTP 400 with "Cannot delete artist with existing records" and the frontend shows that error in an alert rather than deleting. This prevents orphaned records with no artist link.

---

### 9.6 Customers Tab

**Script:** `customers.js`

The Customers tab has the most complex search UI of all tabs.

**Search + filter bar:** A text input (`#searchCustomer`) for name or email substring search, plus a dropdown (`#filterMembership`) with options All Memberships, Regular, Premium, and VIP. Both can be combined: `searchCustomers()` fetches all customers, then filters client-side checking that the full name or email contains the search term AND that the membership type matches the dropdown (if a filter is selected). The "Clear" button reloads all customers unfiltered.

**Add Customer form:** Nine fields — First Name (required), Middle Name (optional), Last Name (required), Email (required; the database trigger validates format), Membership Type (dropdown: Regular, Premium, VIP), Phone (tel input, optional), Street, City, and Pincode. The `addCustomer()` function requires at minimum first name, last name, and email before submitting. On the server side this POSTs to `/api/customers` which opens a MySQL transaction: it inserts the CUSTOMER row first, then (if a phone was provided) inserts a CUSTOMER_PHONE row and commits; any failure rolls back both.

**Customers table:** Columns are **ID**, **Name** (full name assembled from first + middle + last), **Email**, **Membership**, **City**, and **Join Date** (formatted with `toLocaleDateString()`). There are no delete or edit buttons for customers in the current implementation.

---

### 9.7 Transactions Tab

**Script:** `transactions.js`

The Transactions tab handles both Sales and Returns via a single form, and displays a history table below it.

**Dropdowns loading:** When the tab opens, `loadTransactionDropdowns()` fires three parallel API calls to populate:
- Customer dropdown (`#transCustomer`) — shows "First Last" for each customer
- Record dropdown (`#transRecord`) — shows `"Title (N available)"` so the user can see live availability before selecting
- Staff dropdown (`#transStaff`) — shows each staff member's name

**Transaction form:** Six fields — Customer (dropdown), Record (dropdown with availability shown), Staff Processing (dropdown), Quantity (number, min 1, default 1), Unit Price in USD (number, step 0.01), and Transaction Type (dropdown: Sale, Return). On submit the form POSTs to `/api/transactions`. The server validates that there are enough available copies for a Sale; if not, it returns HTTP 400 with the message "Only N copies available". On success, an alert shows the confirmation message and calculated total (`$XX.XX`), the form resets, and both the transaction list and dashboard stats are refreshed.

After a successful transaction, `transactions.js` also checks whether the same customer has an open reservation for that record and calls `updateReservation(id, 'Completed')` on it automatically, keeping reservation status in sync with the frontend.

**Transactions table:** Displays the 50 most recent transactions with columns **ID**, **Date**, **Customer**, **Record**, **Type**, **Quantity**, **Unit Price**, **Total**, and **Staff**.

---

### 9.8 Reservations Tab

**Script:** `reservations.js`

The Reservations tab manages record holds placed by customers.

**Dropdowns:** On tab open, `loadReservationDropdowns()` fetches all customers and all records, populating the `#resCustomer` and `#resRecord` dropdowns. The record dropdown shows `"Title (N available)"` just like in the Transactions tab.

**Add Reservation form:** Two required dropdowns — Customer and Record — and a submit button "Add Reservation". The form handler POSTs to `/api/reservations` which opens a transaction: it inserts a RESERVATION row with `Status = 'Active'` and today's date, then inserts a RESERVES row linking customer, record, and reservation. If the database trigger (`before_reservation_insert`) detects zero available copies it raises an error, which the API returns as HTTP 500 with the trigger's message, displayed in an alert.

**Reservations table:** Columns are **ID**, **Customer**, **Record**, **Date**, **Status**, and **Actions**. The Actions column has two buttons:
- **"Mark Completed"** — calls `updateReservation(id, 'Completed')` which sends `PUT /api/reservations/:id` with `{ status: 'Completed' }` and refreshes the list
- **"Delete"** (red button) — calls `deleteReservation(id)` after a confirmation dialog; sends `DELETE /api/reservations/:id` which removes the RESERVES link then the RESERVATION row inside a transaction

---

### 9.9 Labels Tab

**Script:** `labels.js`

The Labels tab is the simplest management screen.

**Add Label form:** Two fields — Label Name (text, required) and Address (text, optional) — and a submit button "Add Label". POSTs to `/api/labels`, shows the success message from the server, resets, and refreshes the table.

**Labels table:** Columns are **ID**, **Name**, **Address**, and **Actions** (Delete button). `deleteLabel(id)` asks for confirmation then calls `DELETE /api/labels/:id`. Note: there is no guard against deleting a label that has DISTRIBUTED_BY or LABEL_CONTACT rows — this can cause a MySQL foreign key error if those rows exist; the error is surfaced to the user as an alert.

---

### 9.10 Staff Tab

**Script:** `staff.js`

The Staff tab manages employee records.

**Add Staff form:** Four fields — Name (text, required), Role (dropdown: Manager, Sales Associate, Cashier, Inventory Manager; required), Salary (number, step 0.01, required), and Contact Number (tel, optional). POSTs to `/api/staff` which optionally inserts a STAFF_CONTACT row in the same transaction.

**Staff table:** Columns are **ID**, **Name**, **Role**, and **Salary** (prefixed with `$`). There are no delete or edit buttons — staff records are read-only in the current UI. Staff members do appear as a dropdown in the Transactions tab for linking transactions.

---

### 9.11 JavaScript Module Reference

| File | Size | Key functions |
|---|---|---|
| `config.js` | 1 line | Declares `const API_URL = 'http://localhost:3000/api'` used by all other scripts |
| `main.js` | ~70 lines | `showTab(tabName, btn)` — tab switching; `DOMContentLoaded` initialiser |
| `dashboard.js` | ~65 lines | `loadDashboardStats()`, `displayRecentTransactions(list)` |
| `records.js` | ~185 lines | `loadRecords()`, `loadArtistsDropdown()`, `searchRecords()`, `deleteRecord(id, title)`, form submit handler |
| `artists.js` | ~135 lines | `loadArtists()`, `displayArtists(list)`, `searchArtists()`, `deleteArtist(id, name)`, form submit handler |
| `customers.js` | ~245 lines | `loadCustomers()`, `displayCustomers(list)`, `addCustomer(event)`, `searchCustomers()`, `DOMContentLoaded` handler |
| `staff.js` | ~80 lines | `loadStaff()`, form submit handler |
| `transactions.js` | ~145 lines | `loadTransactions()`, `loadTransactionDropdowns()`, form submit handler (also auto-completes reservations) |
| `reservations.js` | ~165 lines | `loadReservationDropdowns()`, `loadReservations()`, `updateReservation(id, status)`, `deleteReservation(id)`, form submit + `DOMContentLoaded` handler |
| `labels.js` | ~100 lines | `loadLabels()`, `deleteLabel(id)`, form submit handler, `DOMContentLoaded` handler |

---

## 10. Setup & Running the Application

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

## 11. Key Design Decisions & Business Rules

1. **Referential integrity is enforced entirely in the database.** Every junction table carries foreign key constraints. Cascade behaviour is not used; the application-layer delete endpoints manually remove child rows before deleting a parent.

2. **Phone numbers are multi-valued attributes stored in separate tables** (`CUSTOMER_PHONE`, `STAFF_CONTACT`, `LABEL_CONTACT`), achieving First Normal Form.

3. **Transaction totals are auto-calculated** by `before_transaction_insert` trigger (`Total_Amount = Unit_Price × Quantity`), ensuring consistency regardless of how rows are inserted.

4. **Email validation** is enforced at the database level by `before_customer_insert_validate`. The API surfaces the trigger's error message directly to the client (HTTP 400 with the trigger message).

5. **Reservation availability** is enforced by the `before_reservation_insert` trigger — a customer cannot reserve a record with zero available copies.

6. **Inventory is decremented** both by the `after_purchase_insert` trigger (fired when a BUYS row is inserted) and by an explicit `UPDATE RECORD` in the API's transaction handler. The double-decrement is a known limitation of the current implementation.

7. **Customer referrals** are tracked in the `REFERS` table as a self-referential many-to-many relationship between customers, allowing the store to model referral chains (who brought in whom).

8. **All multi-step write operations in the API use explicit MySQL transactions** (`beginTransaction` / `commit` / `rollback`) to maintain atomicity — for example, creating a customer and their phone number, or processing a sale and updating inventory.

9. **Artist deletion is guarded**: an artist cannot be deleted if they appear in `PRODUCED_BY`, preventing orphaned catalogue entries.
