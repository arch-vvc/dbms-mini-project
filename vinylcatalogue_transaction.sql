-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: vinylcatalogue
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `Transaction_ID` int NOT NULL,
  `Transaction_Type` varchar(50) DEFAULT NULL,
  `Transaction_Date` date DEFAULT NULL,
  `Unit_Price` decimal(10,2) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Total_Amount` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`Transaction_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,'Purchase','2024-01-01',500.00,2,1000.00),(2,'Purchase','2024-01-05',600.00,1,600.00),(3,'Purchase','2024-01-08',450.00,3,1350.00),(4,'Purchase','2024-01-09',700.00,1,700.00),(5,'Purchase','2024-01-11',300.00,2,600.00),(6,'Purchase','2024-01-13',800.00,1,800.00),(7,'Purchase','2024-01-15',550.00,2,1100.00),(8,'Purchase','2024-01-18',400.00,4,1600.00),(9,'Purchase','2024-01-21',750.00,1,750.00),(10,'Purchase','2024-01-25',650.00,3,1950.00),(20,'Purchase','2025-10-13',500.00,2,1000.00),(101,'Purchase','2025-10-13',500.00,2,1000.00),(201,'Purchase','2025-10-13',500.00,2,1000.00),(302,'Purchase','2025-10-13',400.00,1,400.00),(303,'Purchase','2025-10-13',400.00,1,400.00),(701,'Purchase','2024-10-01',25.00,1,25.00),(702,'Purchase','2024-10-02',30.00,2,60.00),(703,'Purchase','2024-10-03',35.00,1,35.00),(704,'Purchase','2024-10-04',28.50,1,28.50),(705,'Purchase','2024-10-05',40.00,1,40.00);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-28  8:19:43
