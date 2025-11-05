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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `Customer_ID` int NOT NULL,
  `First_Name` varchar(50) DEFAULT NULL,
  `Second_Name` varchar(50) DEFAULT NULL,
  `Last_Name` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Membership_Type` varchar(30) DEFAULT NULL,
  `Date_Of_Join` date DEFAULT NULL,
  `Street` varchar(100) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`Customer_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'John',NULL,'Doe','john@example.com','Gold','2023-01-10','Street A','New York','10001'),(2,'Jane',NULL,'Smith','jane@example.com','Silver','2023-03-15','Street B','Boston','02118'),(3,'Alice',NULL,'Brown','alice@example.com','Gold','2023-04-02','Street C','Seattle','98101'),(4,'Bob',NULL,'Taylor','bob@example.com','Bronze','2023-05-11','Street D','Austin','73301'),(5,'Eve',NULL,'Johnson','eve@example.com','Gold','2023-06-18','Street E','Chicago','60601'),(6,'Chris',NULL,'Adams','chris@example.com','Silver','2023-07-24','Street F','Denver','80201'),(7,'David',NULL,'Lee','david@example.com','Gold','2023-08-30','Street G','Miami','33101'),(8,'Grace',NULL,'Miller','grace@example.com','Platinum','2023-09-14','Street H','LA','90001'),(9,'Oscar',NULL,'Clark','oscar@example.com','Silver','2023-10-05','Street I','Dallas','75201'),(10,'Nina',NULL,'Davis','nina@example.com','Gold','2023-11-09','Street J','San Diego','92101'),(11,'Test',NULL,'User','test@example.com','Gold','2025-01-01','Street Z','Boston','02201'),(501,'Sarah',NULL,'Connor','sarah.c@email.com','Gold','2023-01-15','101 Oak St','New York','10001'),(502,'Mark','A','Ruffalo','mark.ruff@email.com','Silver','2023-02-20','25 Elm Ave','Los Angeles','90002'),(503,'Emily',NULL,'Wong','emily.w@email.com','Bronze','2023-03-01','30 Cedar Rd','Chicago','60601'),(504,'David','S','Lee','david.l@email.com','Gold','2023-04-10','45 Pine Ln','Houston','77001'),(505,'Jessica',NULL,'Perez','jessica.p@email.com','Bronze','2023-05-05','50 Birch Pl','Miami','33101');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
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
