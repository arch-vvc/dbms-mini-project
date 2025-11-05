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
    console.log('Connected to MySQL database');
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// =====================
// RECORDS ENDPOINTS
// =====================
// Get all records
app.get('/api/records', (req, res) => {
    const query = 'SELECT * FROM RECORD ORDER BY Record_ID DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching records:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
            return;
        }
        res.json(results);
    });
});

// Add new record
app.post('/api/records', (req, res) => {
    const { title, genre, edition, catalog_number, total_copies, available_copies } = req.body;
    const query = 'INSERT INTO RECORD (Title, Genre, Edition, Catalog_Number, Total_Copies, Available_Copies) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [title, genre, edition, catalog_number, total_copies, available_copies], (err, result) => {
        if (err) {
            console.error('Error adding record:', err);
            res.status(500).json({ error: 'Failed to add record' });
            return;
        }
        res.json({ id: result.insertId, message: 'Record added successfully' });
    });
});

// =====================
// ARTISTS ENDPOINTS
// =====================
// Get all artists
app.get('/api/artists', (req, res) => {
    const query = 'SELECT * FROM ARTIST ORDER BY Artist_ID DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching artists:', err);
            res.status(500).json({ error: 'Failed to fetch artists' });
            return;
        }
        res.json(results);
    });
});

// Add new artist
app.post('/api/artists', (req, res) => {
    const { name, nationality, type } = req.body;
    const query = 'INSERT INTO ARTIST (Name, Nationality, Type) VALUES (?, ?, ?)';
    
    db.query(query, [name, nationality, type], (err, result) => {
        if (err) {
            console.error('Error adding artist:', err);
            res.status(500).json({ error: 'Failed to add artist' });
            return;
        }
        res.json({ id: result.insertId, message: 'Artist added successfully' });
    });
});

// Delete artist
app.delete('/api/artists/:id', (req, res) => {
    const artistId = req.params.id;
    
    // First check if artist has any records
    db.query('SELECT COUNT(*) as count FROM PRODUCED_BY WHERE Artist_ID = ?', [artistId], (err, results) => {
        if (err) {
            console.error('Error checking artist records:', err);
            res.status(500).json({ error: 'Failed to check artist records' });
            return;
        }
        
        if (results[0].count > 0) {
            res.status(400).json({ error: 'Cannot delete artist with existing records. Remove records first.' });
            return;
        }
        
        // If no records, proceed with deletion
        db.query('DELETE FROM ARTIST WHERE Artist_ID = ?', [artistId], (err, result) => {
            if (err) {
                console.error('Error deleting artist:', err);
                res.status(500).json({ error: 'Failed to delete artist' });
                return;
            }
            
            if (result.affectedRows === 0) {
                res.status(404).json({ error: 'Artist not found' });
                return;
            }
            
            res.json({ message: 'Artist deleted successfully' });
        });
    });
});

// =====================
// CUSTOMERS ENDPOINTS
// =====================
// Get all customers
app.get('/api/customers', (req, res) => {
    const query = 'SELECT * FROM CUSTOMER ORDER BY Customer_ID DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching customers:', err);
            res.status(500).json({ error: 'Failed to fetch customers' });
            return;
        }
        res.json(results);
    });
});

// Add new customer
app.post('/api/customers', (req, res) => {
    const { first_name, second_name, last_name, email, membership_type, street, city, pincode, phone } = req.body;
    
    // Start transaction to add customer and phone
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: 'Transaction failed' });
            return;
        }
        
        // Insert customer
        const customerQuery = 'INSERT INTO CUSTOMER (First_Name, Second_Name, Last_Name, Email, Membership_Type, Date_Of_Join, Street, City, Pincode) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)';
        
        db.query(customerQuery, [first_name, second_name, last_name, email, membership_type, street, city, pincode], (err, result) => {
            if (err) {
                db.rollback();
                console.error('Error adding customer:', err);
                res.status(500).json({ error: 'Failed to add customer' });
                return;
            }
            
            const customerId = result.insertId;
            
            // If phone provided, add to CUSTOMER_PHONE table
            if (phone) {
                const phoneQuery = 'INSERT INTO CUSTOMER_PHONE (Customer_ID, Phone_No) VALUES (?, ?)';
                db.query(phoneQuery, [customerId, phone], (err) => {
                    if (err) {
                        db.rollback();
                        console.error('Error adding phone:', err);
                        res.status(500).json({ error: 'Failed to add phone' });
                        return;
                    }
                    
                    db.commit((err) => {
                        if (err) {
                            db.rollback();
                            res.status(500).json({ error: 'Failed to commit transaction' });
                            return;
                        }
                        res.json({ id: customerId, message: 'Customer added successfully' });
                    });
                });
            } else {
                db.commit((err) => {
                    if (err) {
                        db.rollback();
                        res.status(500).json({ error: 'Failed to commit transaction' });
                        return;
                    }
                    res.json({ id: customerId, message: 'Customer added successfully' });
                });
            }
        });
    });
});

// =====================
// DASHBOARD STATS
// =====================
app.get('/api/stats', (req, res) => {
    const stats = {};
    
    // Get total records
    db.query('SELECT COUNT(*) as count FROM RECORD', (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'Failed to fetch stats' });
            return;
        }
        stats.totalRecords = results[0].count;
        
        // Get total customers
        db.query('SELECT COUNT(*) as count FROM CUSTOMER', (err, results) => {
            if (err) {
                console.error('Error:', err);
                res.status(500).json({ error: 'Failed to fetch stats' });
                return;
            }
            stats.totalCustomers = results[0].count;
            
            // Get active reservations
            db.query('SELECT COUNT(*) as count FROM RESERVATION WHERE Status = "Active" OR Status IS NULL', (err, results) => {
                if (err) {
                    console.error('Error:', err);
                    res.status(500).json({ error: 'Failed to fetch stats' });
                    return;
                }
                stats.activeReservations = results[0].count;
                
                // Get today's sales
                db.query('SELECT SUM(Total_Amount) as total FROM TRANSACTION WHERE DATE(Transaction_Date) = CURDATE()', (err, results) => {
                    if (err) {
                        console.error('Error:', err);
                        res.status(500).json({ error: 'Failed to fetch stats' });
                        return;
                    }
                    stats.todaySales = results[0].total || 0;
                    
                    res.json(stats);
                });
            });
        });
    });
});

// Delete record
app.delete('/api/records/:id', (req, res) => {
    const recordId = req.params.id;
    
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: 'Transaction failed' });
            return;
        }
        
        // Delete from relationship tables first
        db.query('DELETE FROM PRODUCED_BY WHERE Record_ID = ?', [recordId], (err) => {
            if (err) {
                db.rollback();
                console.error('Error deleting record relationships:', err);
                res.status(500).json({ error: 'Failed to delete record relationships' });
                return;
            }
            
            // Now delete the record
            db.query('DELETE FROM RECORD WHERE Record_ID = ?', [recordId], (err, result) => {
                if (err) {
                    db.rollback();
                    console.error('Error deleting record:', err);
                    res.status(500).json({ error: 'Failed to delete record' });
                    return;
                }
                
                db.commit((err) => {
                    if (err) {
                        db.rollback();
                        res.status(500).json({ error: 'Failed to commit transaction' });
                        return;
                    }
                    res.json({ message: 'Record deleted successfully' });
                });
            });
        });
    });
});

// Link record to artist
app.post('/api/records/:recordId/artists/:artistId', (req, res) => {
    const { recordId, artistId } = req.params;
    
    const query = 'INSERT INTO PRODUCED_BY (Record_ID, Artist_ID) VALUES (?, ?)';
    
    db.query(query, [recordId, artistId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: 'This artist is already linked to this record' });
            } else {
                console.error('Error linking artist to record:', err);
                res.status(500).json({ error: 'Failed to link artist to record' });
            }
            return;
        }
        res.json({ message: 'Artist linked to record successfully' });
    });
});

// Get records with their artists
app.get('/api/records-with-artists', (req, res) => {
    const query = `
        SELECT 
            r.*,
            GROUP_CONCAT(a.Name SEPARATOR ', ') as Artists
        FROM RECORD r
        LEFT JOIN PRODUCED_BY pb ON r.Record_ID = pb.Record_ID
        LEFT JOIN ARTIST a ON pb.Artist_ID = a.Artist_ID
        GROUP BY r.Record_ID
        ORDER BY r.Record_ID DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching records with artists:', err);
            res.status(500).json({ error: 'Failed to fetch records' });
            return;
        }
        res.json(results);
    });
});

// =====================
// STAFF ENDPOINTS
// =====================
// Get all staff
app.get('/api/staff', (req, res) => {
    const query = 'SELECT * FROM STAFF ORDER BY Staff_ID DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching staff:', err);
            res.status(500).json({ error: 'Failed to fetch staff' });
            return;
        }
        res.json(results);
    });
});

// Add new staff member
app.post('/api/staff', (req, res) => {
    const { name, role, salary, contact } = req.body;
    
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: 'Transaction failed' });
            return;
        }
        
        // Insert staff
        const staffQuery = 'INSERT INTO STAFF (Name, Role, Salary) VALUES (?, ?, ?)';
        
        db.query(staffQuery, [name, role, salary], (err, result) => {
            if (err) {
                db.rollback();
                console.error('Error adding staff:', err);
                res.status(500).json({ error: 'Failed to add staff' });
                return;
            }
            
            const staffId = result.insertId;
            
            // If contact provided, add to STAFF_CONTACT table
            if (contact) {
                const contactQuery = 'INSERT INTO STAFF_CONTACT (Staff_ID, Contact_No) VALUES (?, ?)';
                db.query(contactQuery, [staffId, contact], (err) => {
                    if (err) {
                        db.rollback();
                        console.error('Error adding contact:', err);
                        res.status(500).json({ error: 'Failed to add contact' });
                        return;
                    }
                    
                    db.commit((err) => {
                        if (err) {
                            db.rollback();
                            res.status(500).json({ error: 'Failed to commit transaction' });
                            return;
                        }
                        res.json({ id: staffId, message: 'Staff member added successfully' });
                    });
                });
            } else {
                db.commit((err) => {
                    if (err) {
                        db.rollback();
                        res.status(500).json({ error: 'Failed to commit transaction' });
                        return;
                    }
                    res.json({ id: staffId, message: 'Staff member added successfully' });
                });
            }
        });
    });
});

// =====================
// TRANSACTION ENDPOINTS
// =====================
// Get all transactions with details
app.get('/api/transactions', (req, res) => {
    const query = `
        SELECT 
            t.*,
            c.First_Name, c.Last_Name,
            r.Title as Record_Title,
            s.Name as Staff_Name
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
        if (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).json({ error: 'Failed to fetch transactions' });
            return;
        }
        res.json(results);
    });
});

// Process a new transaction (sale/return)
app.post('/api/transactions', (req, res) => {
    const { customer_id, record_id, staff_id, quantity, unit_price, transaction_type } = req.body;
    const total_amount = quantity * unit_price;
    
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ error: 'Transaction failed' });
            return;
        }
        
        // Check available copies
        db.query('SELECT Available_Copies FROM RECORD WHERE Record_ID = ?', [record_id], (err, results) => {
            if (err) {
                db.rollback();
                res.status(500).json({ error: 'Failed to check inventory' });
                return;
            }
            
            if (results.length === 0) {
                db.rollback();
                res.status(404).json({ error: 'Record not found' });
                return;
            }
            
            const availableCopies = results[0].Available_Copies;
            
            if (transaction_type === 'Sale' && availableCopies < quantity) {
                db.rollback();
                res.status(400).json({ error: `Only ${availableCopies} copies available` });
                return;
            }
            
            // Insert transaction
            const transQuery = 'INSERT INTO TRANSACTION (Transaction_Type, Transaction_Date, Unit_Price, Quantity, Total_Amount) VALUES (?, NOW(), ?, ?, ?)';
            
            db.query(transQuery, [transaction_type, unit_price, quantity, total_amount], (err, result) => {
                if (err) {
                    db.rollback();
                    console.error('Error creating transaction:', err);
                    res.status(500).json({ error: 'Failed to create transaction' });
                    return;
                }
                
                const transactionId = result.insertId;
                
                // Insert into BUYS table
                db.query('INSERT INTO BUYS (Customer_ID, Record_ID, Transaction_ID) VALUES (?, ?, ?)',
                    [customer_id, record_id, transactionId], (err) => {
                    if (err) {
                        db.rollback();
                        console.error('Error linking transaction:', err);
                        res.status(500).json({ error: 'Failed to link transaction' });
                        return;
                    }
                    
                    // Insert into PROCESSED_BY table
                    db.query('INSERT INTO PROCESSED_BY (Transaction_ID, Staff_ID) VALUES (?, ?)',
                        [transactionId, staff_id], (err) => {
                        if (err) {
                            db.rollback();
                            console.error('Error linking staff:', err);
                            res.status(500).json({ error: 'Failed to link staff' });
                            return;
                        }
                        
                        // Update available copies
                        const newQuantity = transaction_type === 'Sale' ? 
                            availableCopies - quantity : 
                            availableCopies + quantity;
                        
                        db.query('UPDATE RECORD SET Available_Copies = ? WHERE Record_ID = ?',
                            [newQuantity, record_id], (err) => {
                            if (err) {
                                db.rollback();
                                console.error('Error updating inventory:', err);
                                res.status(500).json({ error: 'Failed to update inventory' });
                                return;
                            }
                            
                            db.commit((err) => {
                                if (err) {
                                    db.rollback();
                                    res.status(500).json({ error: 'Failed to commit transaction' });
                                    return;
                                }
                                res.json({ 
                                    id: transactionId, 
                                    message: `${transaction_type} processed successfully`,
                                    total: total_amount 
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});