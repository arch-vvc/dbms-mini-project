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
-- Table structure for table `record`
--

DROP TABLE IF EXISTS `record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `record` (
  `Record_ID` int NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Genre` varchar(50) DEFAULT NULL,
  `Edition` varchar(50) DEFAULT NULL,
  `Catalog_Number` varchar(50) DEFAULT NULL,
  `Total_Copies` int DEFAULT NULL,
  `Available_Copies` int DEFAULT NULL,
  PRIMARY KEY (`Record_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `record`
--

LOCK TABLES `record` WRITE;
/*!40000 ALTER TABLE `record` DISABLE KEYS */;
INSERT INTO `record` VALUES (1,'In Rainbows','Alternative','Deluxe','XL123',30,22),(2,'Abbey Road','Rock','Remastered','EMI101',15,0),(3,'Thriller','Pop','Collector','SONY55',25,20),(4,'Random Access Memories','Electronic','LP','COL789',10,9),(5,'To Pimp a Butterfly','Hip-Hop','Vinyl','TDE22',12,10),(6,'Rumours','Rock','LP','WB77',18,17),(7,'Back to Black','Soul','Deluxe','ISL90',14,12),(8,'OK Computer','Alternative','Reissue','PARLO2',10,6),(9,'Nevermind','Grunge','Vinyl','GEF45',20,19),(10,'1989','Pop','LP','REP32',22,19),(301,'Electric Dreams','Synthwave','Limited','FS001',500,499),(302,'Starlight Serenade','Indie Pop','Standard','VW015',1000,998),(303,'Bass Drop Theory','Techno','Remix','GBR003',200,199),(304,'Whispers in the Rain','Folk','Standard','VW016',800,799),(305,'Café Au Lait','Jazz','Deluxe','FS002',300,299),(306,'The Neon Echoes II','Synthwave','Standard','FS003',500,500),(307,'Deep Cuts','Hip Hop','Standard','GBR004',400,399);
/*!40000 ALTER TABLE `record` ENABLE KEYS */;
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
