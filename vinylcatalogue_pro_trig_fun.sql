-- Trigger 1: Update available copies when a record is sold
DELIMITER //
CREATE TRIGGER after_purchase_insert
AFTER INSERT ON BUYS
FOR EACH ROW
BEGIN
    DECLARE qty INT;
    
    -- Get quantity from transaction
    SELECT Quantity INTO qty
    FROM TRANSACTION
    WHERE Transaction_ID = NEW.Transaction_ID;
    
    -- Decrease available copies
    UPDATE RECORD
    SET Available_Copies = Available_Copies - qty
    WHERE Record_ID = NEW.Record_ID;
END//
DELIMITER ;

-- Trigger 2: Validate available copies before reservation
DELIMITER //
CREATE TRIGGER before_reservation_insert
BEFORE INSERT ON RESERVES
FOR EACH ROW
BEGIN
    DECLARE available INT;
    
    SELECT Available_Copies INTO available
    FROM RECORD
    WHERE Record_ID = NEW.Record_ID;
    
    IF available <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot reserve: No copies available';
    END IF;
END//
DELIMITER ;

-- Trigger 3: Update reservation status when purchase is made
DELIMITER //
CREATE TRIGGER after_purchase_update_reservation
AFTER INSERT ON BUYS
FOR EACH ROW
BEGIN
    -- Mark any pending reservations as completed
    UPDATE RESERVATION r
    INNER JOIN RESERVES res ON r.Reservation_ID = res.Reservation_ID
    SET r.Status = 'Completed'
    WHERE res.Customer_ID = NEW.Customer_ID
    AND res.Record_ID = NEW.Record_ID
    AND r.Status = 'Pending';
END//
DELIMITER ;

-- Trigger 4: Auto-calculate transaction total amount
DELIMITER //
CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON TRANSACTION
FOR EACH ROW
BEGIN
    SET NEW.Total_Amount = NEW.Unit_Price * NEW.Quantity;
END//
DELIMITER ;

-- Trigger 5: Validate email format on customer insert/update
DELIMITER //
CREATE TRIGGER before_customer_insert_validate
BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
    IF NEW.Email NOT LIKE '%_@__%.__%' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format';
    END IF;
END//
DELIMITER ;

-- ===============================
-- STORED PROCEDURES (3)
-- ===============================

-- Procedure 1: Process a purchase transaction
DELIMITER //
CREATE PROCEDURE ProcessPurchase(
    IN p_customer_id INT,
    IN p_record_id INT,
    IN p_transaction_id INT,
    IN p_quantity INT,
    IN p_unit_price DECIMAL(10,2),
    IN p_staff_id INT
)
BEGIN
    DECLARE available INT;
    
    -- Check availability
    SELECT Available_Copies INTO available
    FROM RECORD
    WHERE Record_ID = p_record_id;
    
    IF available < p_quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient copies available';
    ELSE
        -- Insert transaction
        INSERT INTO TRANSACTION (Transaction_ID, Transaction_Type, Transaction_Date, Unit_Price, Quantity, Total_Amount)
        VALUES (p_transaction_id, 'Purchase', CURDATE(), p_unit_price, p_quantity, p_unit_price * p_quantity);
        
        -- Link transaction to staff
        INSERT INTO PROCESSED_BY (Transaction_ID, Staff_ID)
        VALUES (p_transaction_id, p_staff_id);
        
        -- Link purchase
        INSERT INTO BUYS (Customer_ID, Record_ID, Transaction_ID)
        VALUES (p_customer_id, p_record_id, p_transaction_id);
        
        SELECT 'Purchase completed successfully' AS Message;
    END IF;
END//
DELIMITER ;

-- Procedure 2: Get customer purchase history
DELIMITER //
CREATE PROCEDURE GetCustomerPurchaseHistory(
    IN p_customer_id INT
)
BEGIN
    SELECT 
        t.Transaction_ID,
        t.Transaction_Date,
        r.Title AS Record_Title,
        r.Genre,
        t.Quantity,
        t.Unit_Price,
        t.Total_Amount
    FROM TRANSACTION t
    INNER JOIN BUYS b ON t.Transaction_ID = b.Transaction_ID
    INNER JOIN RECORD r ON b.Record_ID = r.Record_ID
    WHERE b.Customer_ID = p_customer_id
    ORDER BY t.Transaction_Date DESC;
END//
DELIMITER ;

-- Procedure 3: Restock records
DELIMITER //
CREATE PROCEDURE RestockRecord(
    IN p_record_id INT,
    IN p_additional_copies INT
)
BEGIN
    UPDATE RECORD
    SET Total_Copies = Total_Copies + p_additional_copies,
        Available_Copies = Available_Copies + p_additional_copies
    WHERE Record_ID = p_record_id;
    
    SELECT CONCAT('Added ', p_additional_copies, ' copies to inventory') AS Message;
END//
DELIMITER ;

-- ===============================
-- FUNCTIONS (2)
-- ===============================

-- Function 1: Get customer's total spending
DELIMITER //
CREATE FUNCTION GetCustomerTotalSpending(p_customer_id INT)
RETURNS DECIMAL(12,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(12,2);
    
    SELECT COALESCE(SUM(t.Total_Amount), 0) INTO total
    FROM TRANSACTION t
    INNER JOIN BUYS b ON t.Transaction_ID = b.Transaction_ID
    WHERE b.Customer_ID = p_customer_id;
    
    RETURN total;
END//
DELIMITER ;

-- Function 2: Check if record is available
DELIMITER //
CREATE FUNCTION IsRecordAvailable(p_record_id INT)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE available INT;
    
    SELECT Available_Copies INTO available
    FROM RECORD
    WHERE Record_ID = p_record_id;
    
    RETURN available > 0;
END//
DELIMITER ;