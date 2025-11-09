const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});


// =====================
// RECORDS ENDPOINTS
// =====================
app.get('/api/records', (req, res) => {
    const query = 'SELECT * FROM RECORD ORDER BY Record_ID DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching records:', err);
            return res.status(500).json({ error: 'Failed to fetch records' });
        }
        res.json(results);
    });
});

app.post('/api/records', (req, res) => {
    const { title, genre, edition, catalog_number, total_copies, available_copies } = req.body;
    const query = 'INSERT INTO RECORD (Title, Genre, Edition, Catalog_Number, Total_Copies, Available_Copies) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, genre, edition, catalog_number, total_copies, available_copies], (err, result) => {
        if (err) {
            console.error('Error adding record:', err);
            return res.status(500).json({ error: 'Failed to add record' });
        }
        res.json({ id: result.insertId, message: 'Record added successfully' });
    });
});

// ✅ FIXED DELETE RECORD
app.delete('/api/records/:id', (req, res) => {
    const recordId = req.params.id;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        const relationTables = [
            'DELETE FROM PRODUCED_BY WHERE Record_ID = ?',
            'DELETE FROM DISTRIBUTED_BY WHERE Record_ID = ?',
            'DELETE FROM BUYS WHERE Record_ID = ?',
            'DELETE FROM RESERVES WHERE Record_ID = ?'
        ];

        let completed = 0;
        relationTables.forEach((query) => {
            db.query(query, [recordId], (err) => {
                if (err) {
                    console.error('Error deleting related data:', err);
                    db.rollback();
                    return res.status(500).json({ error: 'Failed to delete related data' });
                }

                completed++;
                if (completed === relationTables.length) {
                    db.query('DELETE FROM RECORD WHERE Record_ID = ?', [recordId], (err) => {
                        if (err) {
                            console.error('Error deleting record:', err);
                            db.rollback();
                            return res.status(500).json({ error: 'Failed to delete record' });
                        }

                        db.commit((err) => {
                            if (err) {
                                db.rollback();
                                return res.status(500).json({ error: 'Commit failed' });
                            }
                            res.json({ message: 'Record deleted successfully' });
                        });
                    });
                }
            });
        });
    });
});


// =====================
// ARTISTS ENDPOINTS
// =====================
app.get('/api/artists', (req, res) => {
    db.query('SELECT * FROM ARTIST ORDER BY Artist_ID DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch artists' });
        res.json(results);
    });
});

app.post('/api/artists', (req, res) => {
    const { name, nationality, type } = req.body;
    db.query('INSERT INTO ARTIST (Name, Nationality, Type) VALUES (?, ?, ?)', [name, nationality, type], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add artist' });
        res.json({ id: result.insertId, message: 'Artist added successfully' });
    });
});

app.delete('/api/artists/:id', (req, res) => {
    const artistId = req.params.id;
    db.query('SELECT COUNT(*) as count FROM PRODUCED_BY WHERE Artist_ID = ?', [artistId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Check failed' });

        if (results[0].count > 0) {
            return res.status(400).json({ error: 'Cannot delete artist with existing records' });
        }

        db.query('DELETE FROM ARTIST WHERE Artist_ID = ?', [artistId], (err) => {
            if (err) return res.status(500).json({ error: 'Delete failed' });
            res.json({ message: 'Artist deleted successfully' });
        });
    });
});


// =====================
// CUSTOMERS ENDPOINTS
// =====================
app.get('/api/customers', (req, res) => {
    db.query('SELECT * FROM CUSTOMER ORDER BY Customer_ID DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch customers' });
        res.json(results);
    });
});

app.post('/api/customers', (req, res) => {
    const { first_name, second_name, last_name, email, membership_type, street, city, pincode,phone } = req.body;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        const customerQuery = `
            INSERT INTO CUSTOMER 
            (First_Name, Second_Name, Last_Name, Email, Membership_Type, Date_Of_Join, Street, City, Pincode) 
            VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)
        `;

        db.query(customerQuery, [first_name, second_name, last_name, email, membership_type, street, city, pincode], (err, result) => {
            if (err) {
                db.rollback();
                if (err.sqlState === '45000') {
                    return res.status(400).json({ error: err.sqlMessage });
                }
                return res.status(500).json({ error: 'Failed to add customer' });
            }

            const customerId = result.insertId;

            if (phone) {
                db.query('INSERT INTO CUSTOMER_PHONE (Customer_ID, Phone_No) VALUES (?, ?)', [customerId, phone], (err) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({ error: 'Failed to add phone' });
                    }
                    db.commit();
                    res.json({ id: customerId, message: 'Customer added successfully' });
                });
            } else {
                db.commit();
                res.json({ id: customerId, message: 'Customer added successfully' });
            }
        });
    });
});


// =====================
// DASHBOARD STATS
// =====================
app.get('/api/stats', (req, res) => {
    const stats = {};

    db.query('SELECT COUNT(*) AS total FROM RECORD', (err, recordResults) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
        stats.totalRecords = recordResults[0].total || 0;

        db.query('SELECT COUNT(*) AS total FROM CUSTOMER', (err, custResults) => {
            if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
            stats.totalCustomers = custResults[0].total || 0;

            db.query('SELECT COUNT(*) AS total FROM RESERVATION WHERE Status = "Active"', (err, resResults) => {
                if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
                stats.activeReservations = resResults[0].total || 0;

                db.query('SELECT IFNULL(SUM(Total_Amount), 0) AS total FROM TRANSACTION WHERE DATE(Transaction_Date) = CURDATE()', (err, salesResults) => {
                    if (err) return res.status(500).json({ error: 'Failed to fetch stats' });
                    stats.todaySales = salesResults[0].total || 0;

                    const recentQuery = `
                        SELECT 
                            t.Transaction_ID,
                            t.Transaction_Date,
                            t.Transaction_Type,
                            t.Total_Amount,
                            c.First_Name,
                            c.Last_Name,
                            r.Title
                        FROM TRANSACTION t
                        LEFT JOIN BUYS b ON t.Transaction_ID = b.Transaction_ID
                        LEFT JOIN CUSTOMER c ON b.Customer_ID = c.Customer_ID
                        LEFT JOIN RECORD r ON b.Record_ID = r.Record_ID
                        ORDER BY t.Transaction_Date DESC, t.Transaction_ID DESC
                        LIMIT 5;
                    `;
                    db.query(recentQuery, (err, recents) => {
                        if (err) return res.status(500).json({ error: 'Failed to fetch recents' });
                        stats.recentTransactions = recents || [];
                        res.json(stats);
                    });
                });
            });
        });
    });
});


// =====================
// STAFF ENDPOINTS
// =====================
app.get('/api/staff', (req, res) => {
    db.query('SELECT * FROM STAFF ORDER BY Staff_ID DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch staff' });
        res.json(results);
    });
});

app.post('/api/staff', (req, res) => {
    const { name, role, salary, contact } = req.body;
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        db.query('INSERT INTO STAFF (Name, Role, Salary) VALUES (?, ?, ?)', [name, role, salary], (err, result) => {
            if (err) {
                db.rollback();
                return res.status(500).json({ error: 'Failed to add staff' });
            }

            const staffId = result.insertId;

            if (contact) {
                db.query('INSERT INTO STAFF_CONTACT (Staff_ID, Contact_No) VALUES (?, ?)', [staffId, contact], (err) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({ error: 'Failed to add contact' });
                    }
                    db.commit();
                    res.json({ id: staffId, message: 'Staff member added successfully' });
                });
            } else {
                db.commit();
                res.json({ id: staffId, message: 'Staff member added successfully' });
            }
        });
    });
});


// =====================
// TRANSACTIONS ENDPOINTS
// =====================
app.get('/api/transactions', (req, res) => {
    const query = `
        SELECT 
            t.*,
            c.First_Name, c.Last_Name,
            r.Title AS Record_Title,
            s.Name AS Staff_Name
        FROM TRANSACTION t
        LEFT JOIN BUYS b ON t.Transaction_ID = b.Transaction_ID
        LEFT JOIN CUSTOMER c ON b.Customer_ID = c.Customer_ID
        LEFT JOIN RECORD r ON b.Record_ID = r.Record_ID
        LEFT JOIN PROCESSED_BY p ON t.Transaction_ID = p.Transaction_ID
        LEFT JOIN STAFF s ON p.Staff_ID = s.Staff_ID
        ORDER BY t.Transaction_Date DESC, t.Transaction_ID DESC
        LIMIT 50
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch transactions' });
        res.json(results);
    });
});

app.post('/api/transactions', (req, res) => {
    const { customer_id, record_id, staff_id, quantity, unit_price, transaction_type } = req.body;
    const total_amount = quantity * unit_price;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        db.query('SELECT Available_Copies FROM RECORD WHERE Record_ID = ?', [record_id], (err, results) => {
            if (err || !results.length) {
                db.rollback();
                return res.status(500).json({ error: 'Invalid record' });
            }

            const available = results[0].Available_Copies;
            if (transaction_type === 'Sale' && available < quantity) {
                db.rollback();
                return res.status(400).json({ error: `Only ${available} copies available` });
            }

            db.query('INSERT INTO TRANSACTION (Transaction_Type, Transaction_Date, Unit_Price, Quantity, Total_Amount) VALUES (?, NOW(), ?, ?, ?)',
                [transaction_type, unit_price, quantity, total_amount], (err, result) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({ error: 'Failed to create transaction' });
                    }

                    const tid = result.insertId;

                    db.query('INSERT INTO BUYS (Customer_ID, Record_ID, Transaction_ID) VALUES (?, ?, ?)', [customer_id, record_id, tid], (err) => {
                        if (err) {
                            db.rollback();
                            return res.status(500).json({ error: 'Failed to link customer' });
                        }

                        db.query('INSERT INTO PROCESSED_BY (Transaction_ID, Staff_ID) VALUES (?, ?)', [tid, staff_id], (err) => {
                            if (err) {
                                db.rollback();
                                return res.status(500).json({ error: 'Failed to link staff' });
                            }

                            const newQty = transaction_type === 'Sale' ? available - quantity : available + quantity;
                            db.query('UPDATE RECORD SET Available_Copies = ? WHERE Record_ID = ?', [newQty, record_id], (err) => {
                                if (err) {
                                    db.rollback();
                                    return res.status(500).json({ error: 'Failed to update inventory' });
                                }

                                db.commit();
                                res.json({ id: tid, message: `${transaction_type} processed successfully`, total: total_amount });
                            });
                        });
                    });
                });
        });
    });
});


// =====================
// RESERVATIONS ENDPOINTS
// =====================
app.get('/api/reservations', (req, res) => {
    const query = `
        SELECT 
            r.Reservation_ID,
            r.Reservation_Date,
            r.Status,
            c.First_Name, c.Last_Name,
            rs.Customer_ID,
            rs.Record_ID,
            rec.Title AS Record_Title
        FROM RESERVATION r
        JOIN RESERVES rs ON r.Reservation_ID = rs.Reservation_ID
        JOIN CUSTOMER c ON rs.Customer_ID = c.Customer_ID
        JOIN RECORD rec ON rs.Record_ID = rec.Record_ID
        ORDER BY r.Reservation_ID DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch reservations' });
        res.json(results);
    });
});

app.post('/api/reservations', (req, res) => {
    const { customer_id, record_id } = req.body;
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        db.query('INSERT INTO RESERVATION (Reservation_Date, Status) VALUES (CURDATE(), "Active")', (err, result) => {
            if (err) {
                db.rollback();
                return res.status(500).json({ error: 'Failed to create reservation' });
            }
            const rid = result.insertId;

            db.query('INSERT INTO RESERVES (Customer_ID, Record_ID, Reservation_ID) VALUES (?, ?, ?)', [customer_id, record_id, rid], (err) => {
                if (err) {
                    db.rollback();
                    return res.status(500).json({ error: 'Failed to link reservation' });
                }
                db.commit();
                res.json({ id: rid, message: 'Reservation created successfully' });
            });
        });
    });
});

app.put('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query('UPDATE RESERVATION SET Status = ? WHERE Reservation_ID = ?', [status, id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update status' });
        res.json({ message: 'Status updated' });
    });
});

app.delete('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Transaction failed' });

        db.query('DELETE FROM RESERVES WHERE Reservation_ID = ?', [id], (err) => {
            if (err) {
                db.rollback();
                return res.status(500).json({ error: 'Failed to delete link' });
            }
            db.query('DELETE FROM RESERVATION WHERE Reservation_ID = ?', [id], (err) => {
                if (err) {
                    db.rollback();
                    return res.status(500).json({ error: 'Failed to delete reservation' });
                }
                db.commit();
                res.json({ message: 'Reservation deleted successfully' });
            });
        });
    });
});


// =====================
// LABELS ENDPOINTS
// =====================
app.get('/api/labels', (req, res) => {
    db.query('SELECT * FROM LABEL ORDER BY Label_ID DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch labels' });
        res.json(results);
    });
});

app.post('/api/labels', (req, res) => {
    const { name, address } = req.body;
    db.query('INSERT INTO LABEL (Name, Address) VALUES (?, ?)', [name, address], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to add label' });
        res.json({ id: result.insertId, message: 'Label added successfully' });
    });
});

app.delete('/api/labels/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM LABEL WHERE Label_ID = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete label' });
        res.json({ message: 'Label deleted successfully' });
    });
});


// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});