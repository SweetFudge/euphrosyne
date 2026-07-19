-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: euphrosyne
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `catalogue_item_labels`
--

DROP TABLE IF EXISTS `catalogue_item_labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogue_item_labels` (
  `catalogue_item_id` bigint NOT NULL,
  `label_id` bigint NOT NULL,
  KEY `FKo2rnygo2647h4yr7lo4p146x5` (`label_id`),
  KEY `FKjv7n1hp64pa8a4i7fx14ut5e9` (`catalogue_item_id`),
  CONSTRAINT `FKjv7n1hp64pa8a4i7fx14ut5e9` FOREIGN KEY (`catalogue_item_id`) REFERENCES `catalogue_items` (`id`),
  CONSTRAINT `FKo2rnygo2647h4yr7lo4p146x5` FOREIGN KEY (`label_id`) REFERENCES `labels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogue_item_labels`
--

LOCK TABLES `catalogue_item_labels` WRITE;
/*!40000 ALTER TABLE `catalogue_item_labels` DISABLE KEYS */;
INSERT INTO `catalogue_item_labels` VALUES (3,1),(3,2),(3,3),(1,1),(2,1),(2,2),(4,1),(4,2),(5,1),(5,3),(6,1),(6,2),(6,3),(7,1),(7,2),(7,3),(8,1),(8,2),(9,1),(10,2);
/*!40000 ALTER TABLE `catalogue_item_labels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogue_items`
--

DROP TABLE IF EXISTS `catalogue_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogue_items` (
  `category_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('DRAFT','PUBLISHED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq4hlroyitsga9xpy38c6rsc5` (`category_id`),
  CONSTRAINT `FKq4hlroyitsga9xpy38c6rsc5` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogue_items`
--

LOCK TABLES `catalogue_items` WRITE;
/*!40000 ALTER TABLE `catalogue_items` DISABLE KEYS */;
INSERT INTO `catalogue_items` VALUES (1,'2026-03-25 17:50:19.466724',1,'Arche rustique en bois flotté, idéale pour un mariage champêtre ou bohème.','/uploads/c40c2ed3-a65a-4422-b72b-b3095028382f.webp','Arche en bois flotté','PUBLISHED'),(1,'2026-03-25 17:50:19.466724',2,'Structure en métal doré élégante, adaptable à tout type d\'événement.','/uploads/c12085df-0e4b-488e-92d4-f6fc0272be9e.jpg','Arche métallique dorée','PUBLISHED'),(2,'2026-03-25 17:50:19.466724',3,'Ensemble de centres de table aux finitions dorées, disponibles en plusieurs hauteurs.','/uploads/a76228d9-1fae-4930-b46f-93f3b24a69c5.jpg','Centres de table dorés','PUBLISHED'),(2,'2026-03-25 17:50:19.466724',4,'Chandeliers en cristal soufflé, pour une ambiance lumineuse et raffinée.','/uploads/85bacb14-5504-4b02-89bb-91b54add09d4.avif','Chandeliers en cristal','PUBLISHED'),(3,'2026-03-25 17:50:19.466724',5,'Bouquets en fleurs artificielles haut de gamme — rendu naturel, conservation garantie.','/uploads/bc8b00e7-5935-4ae1-a11a-ef0e1d8ceaab.jpg','Bouquets floraux artificiels','PUBLISHED'),(3,'2026-03-25 17:50:19.466724',6,'Guirlandes de feuillage artificiel pour habiller tables, arches et murs.','/uploads/2e0bddeb-e037-4141-872b-23ab699fa568.jpg','Guirlandes de verdure','PUBLISHED'),(4,'2026-03-25 17:50:19.466724',7,'Nappes en satin blanc pur, disponibles en toutes dimensions. Repassées et prêtes à poser.','/uploads/6bc604a0-a7e8-48d1-8c44-9b4094af5870.jpg','Nappes satin blanc','PUBLISHED'),(4,'2026-03-25 17:50:19.466724',8,'Chemins de table en organza doré pour apporter éclat et raffinement à chaque couvert.','/uploads/be9b4593-b800-49d4-8078-f18cc44ac1be.jpg','Chemins de table dorés','PUBLISHED'),(14,'2026-03-29 14:55:22.891089',9,'CECI EST un coussin noir','/uploads/10e2c04f-48b7-460a-9ca5-31df22ba509b.jpg','Coussin','PUBLISHED'),(1,'2026-03-29 17:46:46.193698',10,'ADFASDFASD','/uploads/0c7fe8f2-0a8e-46c9-8e20-340ab05bd5e2.jpg','AAA','PUBLISHED');
/*!40000 ALTER TABLE `catalogue_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `scope` enum('CATALOGUE','PORTFOLIO') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_756nasu14yc8j31c6w75gfes7` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('2026-03-25 17:50:19.347724',1,NULL,'arches-structures','Arches & Structures','CATALOGUE'),('2026-03-25 17:50:19.355725',2,NULL,'decoration-de-table','Décoration de table','CATALOGUE'),('2026-03-25 17:50:19.361224',3,NULL,'fleurs-vegetaux','Fleurs & Végétaux','CATALOGUE'),('2026-03-25 17:50:19.368224',4,NULL,'linge-de-table','Linge de table','CATALOGUE'),('2026-03-25 17:50:19.372223',5,NULL,'mariage-classique','Mariage Classique','PORTFOLIO'),('2026-03-25 17:50:19.377223',6,NULL,'mariage-boheme','Mariage Bohème','PORTFOLIO'),('2026-03-25 17:50:19.381723',7,NULL,'mariage-atypique','Mariage Atypique','PORTFOLIO'),('2026-03-25 17:50:19.386224',8,NULL,'anniversaire-enfants','Anniversaire Enfants','PORTFOLIO'),('2026-03-25 17:50:19.390724',9,NULL,'anniversaire-adultes','Anniversaire Adultes','PORTFOLIO'),('2026-03-25 17:50:19.395723',10,NULL,'fete-privee','Fête Privée','PORTFOLIO'),('2026-03-29 14:53:52.603344',14,NULL,'mobilier','Mobilier','CATALOGUE');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `event_date` date DEFAULT NULL,
  `read` bit(1) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `event_type` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `message` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES ('2028-08-01',_binary '\0','2026-03-25 20:55:49.190547',1,'adriano.piazza.pa@gmail.com','MARIAGE','Jenifer','Belda','quiero casarme con mi amorcito');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `labels`
--

DROP TABLE IF EXISTS `labels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `labels` (
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_hyvbnfe7354kigo149rj39iw7` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `labels`
--

LOCK TABLES `labels` WRITE;
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;
INSERT INTO `labels` VALUES ('2026-03-25 17:50:19.405723',1,NULL,'mariage','Mariage'),('2026-03-25 17:50:19.410723',2,NULL,'fete-privee','Fête Privée'),('2026-03-25 17:50:19.415224',3,NULL,'anniversaire','Anniversaire');
/*!40000 ALTER TABLE `labels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_campaigns`
--

DROP TABLE IF EXISTS `newsletter_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_campaigns` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `design_json` longtext,
  `html_content` longtext NOT NULL,
  `recipient_count` int NOT NULL,
  `sent_at` datetime(6) NOT NULL,
  `subject` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_campaigns`
--

LOCK TABLES `newsletter_campaigns` WRITE;
/*!40000 ALTER TABLE `newsletter_campaigns` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `active` bit(1) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `subscribed_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_qqdefkuupml4s7190ettcy6jy` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
INSERT INTO `newsletter_subscribers` VALUES (_binary '',1,'2026-03-26 22:57:28.662225','adriano.piazza.pa@gmail.com'),(_binary '',2,'2026-03-29 14:50:36.719923','delia.piazza@gmail.com');
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_templates`
--

DROP TABLE IF EXISTS `newsletter_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_templates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `design_json` longtext NOT NULL,
  `html_content` longtext NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_templates`
--

LOCK TABLES `newsletter_templates` WRITE;
/*!40000 ALTER TABLE `newsletter_templates` DISABLE KEYS */;
INSERT INTO `newsletter_templates` VALUES (1,'2026-03-26 23:40:13.788654','{\"counters\":{\"u_column\":1,\"u_row\":1,\"u_content_heading\":1},\"body\":{\"id\":\"joiDm2YPod\",\"rows\":[{\"id\":\"yT-Nx63LOd\",\"cells\":[1],\"columns\":[{\"id\":\"kFQ36iqOHI\",\"contents\":[{\"id\":\"TB3zafdQM9\",\"type\":\"heading\",\"values\":{\"textJson\":\"{\\\"root\\\":{\\\"children\\\":[{\\\"children\\\":[{\\\"detail\\\":0,\\\"format\\\":0,\\\"mode\\\":\\\"normal\\\",\\\"style\\\":\\\"\\\",\\\"text\\\":\\\"test test TEST \\\",\\\"type\\\":\\\"extended-text\\\",\\\"version\\\":1}],\\\"format\\\":\\\"\\\",\\\"indent\\\":0,\\\"type\\\":\\\"heading-paragraph\\\",\\\"version\\\":1,\\\"textFormat\\\":0,\\\"textStyle\\\":\\\"\\\"}],\\\"format\\\":\\\"\\\",\\\"indent\\\":0,\\\"type\\\":\\\"root\\\",\\\"version\\\":1}}\",\"containerPadding\":\"10px\",\"anchor\":\"\",\"headingType\":\"h1\",\"fontSize\":\"22px\",\"textAlign\":\"left\",\"lineHeight\":\"140%\",\"linkStyle\":{\"inherit\":true,\"linkColor\":\"#0000ee\",\"linkHoverColor\":\"#0000ee\",\"linkUnderline\":true,\"linkHoverUnderline\":true},\"displayCondition\":null,\"_styleGuide\":null,\"_meta\":{\"htmlID\":\"u_content_heading_1\",\"htmlClassNames\":\"u_content_heading\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false,\"_languages\":{}}}],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_1\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}}],\"values\":{\"displayCondition\":null,\"columns\":false,\"_styleGuide\":null,\"backgroundColor\":\"\",\"columnsBackgroundColor\":\"\",\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"padding\":\"0px\",\"anchor\":\"\",\"hideDesktop\":false,\"_meta\":{\"htmlID\":\"u_row_1\",\"htmlClassNames\":\"u_row\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false}}],\"headers\":[],\"footers\":[],\"values\":{\"_styleGuide\":null,\"popupPosition\":\"center\",\"popupDisplayDelay\":0,\"popupWidth\":\"600px\",\"popupHeight\":\"auto\",\"borderRadius\":\"10px\",\"contentAlign\":\"center\",\"contentVerticalAlign\":\"middle\",\"contentWidth\":\"500px\",\"fontFamily\":{\"label\":\"Arial\",\"value\":\"arial,helvetica,sans-serif\"},\"textColor\":\"#000000\",\"popupBackgroundColor\":\"#FFFFFF\",\"popupBackgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"cover\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"popupOverlay_backgroundColor\":\"rgba(0, 0, 0, 0.1)\",\"popupCloseButton_position\":\"top-right\",\"popupCloseButton_backgroundColor\":\"#DDDDDD\",\"popupCloseButton_iconColor\":\"#000000\",\"popupCloseButton_borderRadius\":\"0px\",\"popupCloseButton_margin\":\"0px\",\"popupCloseButton_action\":{\"name\":\"close_popup\",\"attrs\":{\"onClick\":\"document.querySelector(\'.u-popup-container\').style.display = \'none\';\"}},\"language\":{},\"backgroundColor\":\"#F7F8F9\",\"preheaderText\":\"\",\"linkStyle\":{\"body\":true,\"linkColor\":\"#0000ee\",\"linkHoverColor\":\"#0000ee\",\"linkUnderline\":true,\"linkHoverUnderline\":true},\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"accessibilityTitle\":\"\",\"_meta\":{\"htmlID\":\"u_body\",\"htmlClassNames\":\"u_body\"}}},\"schemaVersion\":24}','<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n<head>\n<!--[if gte mso 9]>\n<xml>\n  <o:OfficeDocumentSettings>\n    <o:AllowPNG/>\n    <o:PixelsPerInch>96</o:PixelsPerInch>\n  </o:OfficeDocumentSettings>\n</xml>\n<![endif]-->\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta name=\"x-apple-disable-message-reformatting\">\n  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n  \n  \n    <style type=\"text/css\">\n      \n      @media only screen and (min-width: 520px) {\n        .u-row {\n          width: 500px !important;\n        }\n\n        .u-row .u-col {\n          vertical-align: top;\n        }\n\n        \n            .u-row .u-col-100 {\n              width: 500px !important;\n            }\n          \n      }\n\n      @media only screen and (max-width: 520px) {\n        .u-row-container {\n          max-width: 100% !important;\n          padding-left: 0px !important;\n          padding-right: 0px !important;\n        }\n\n        .u-row {\n          width: 100% !important;\n        }\n\n        .u-row .u-col {\n          display: block !important;\n          width: 100% !important;\n          min-width: 320px !important;\n          max-width: 100% !important;\n        }\n\n        .u-row .u-col > div {\n          margin: 0 auto;\n        }\n\n}\n    \nbody{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}\n\n\ntable, td { color: #000000; } </style>\n  \n  \n\n</head>\n\n<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F7F8F9;color: #000000\">\n  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n  <table role=\"presentation\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F7F8F9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n  <tbody>\n  <tr style=\"vertical-align: top\">\n    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n    <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #F7F8F9;\"><![endif]-->\n    \n  \n  \n<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n  <div class=\"u-row\" style=\"margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\">\n    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n      <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px;\"><tr style=\"background-color: transparent;\"><![endif]-->\n      \n<!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\"width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n<table style=\"font-family:arial,helvetica,sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n  <tbody>\n    <tr>\n      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;\" align=\"left\">\n        \n  <!--[if mso]><table role=\"presentation\" width=\"100%\"><tr><td><![endif]-->\n    <h1 style=\"margin: 0px; line-height: 140%; text-align: left; word-wrap: break-word; font-size: 22px; font-weight: 400;\"><span><span>test test TEST </span></span></h1>\n  <!--[if mso]></td></tr></table><![endif]-->\n\n      </td>\n    </tr>\n  </tbody>\n</table>\n\n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n    </div>\n  </div>\n  </div>\n  \n\n\n    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n    </td>\n  </tr>\n  </tbody>\n  </table>\n  <!--[if mso]></div><![endif]-->\n  <!--[if IE]></div><![endif]-->\n</body>\n\n</html>\n','model1'),(2,'2026-03-29 14:48:17.576950','{\"counters\":{\"u_column\":3,\"u_row\":2},\"body\":{\"id\":\"vACL1eD1Gz\",\"rows\":[{\"id\":\"RsAGBszAdJ\",\"cells\":[1],\"columns\":[{\"id\":\"lEST--F_No\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_1\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}}],\"values\":{\"displayCondition\":null,\"columns\":false,\"_styleGuide\":null,\"backgroundColor\":\"\",\"columnsBackgroundColor\":\"\",\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"padding\":\"0px\",\"anchor\":\"\",\"hideDesktop\":false,\"_meta\":{\"htmlID\":\"u_row_1\",\"htmlClassNames\":\"u_row\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false}},{\"id\":\"7R3hxeZb6v\",\"cells\":[1,1],\"columns\":[{\"id\":\"fsde4P-DUL\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_2\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}},{\"id\":\"dkcETHBQFT\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_3\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}}],\"values\":{\"displayCondition\":null,\"columns\":false,\"_styleGuide\":null,\"backgroundColor\":\"\",\"columnsBackgroundColor\":\"\",\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\"},\"padding\":\"0px\",\"anchor\":\"\",\"_meta\":{\"htmlID\":\"u_row_2\",\"htmlClassNames\":\"u_row\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false}}],\"headers\":[],\"footers\":[],\"values\":{\"_styleGuide\":null,\"popupPosition\":\"center\",\"popupDisplayDelay\":0,\"popupWidth\":\"600px\",\"popupHeight\":\"auto\",\"borderRadius\":\"10px\",\"contentAlign\":\"center\",\"contentVerticalAlign\":\"middle\",\"contentWidth\":\"500px\",\"fontFamily\":{\"label\":\"Arial\",\"value\":\"arial,helvetica,sans-serif\"},\"textColor\":\"#000000\",\"popupBackgroundColor\":\"#FFFFFF\",\"popupBackgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"cover\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"popupOverlay_backgroundColor\":\"rgba(0, 0, 0, 0.1)\",\"popupCloseButton_position\":\"top-right\",\"popupCloseButton_backgroundColor\":\"#DDDDDD\",\"popupCloseButton_iconColor\":\"#000000\",\"popupCloseButton_borderRadius\":\"0px\",\"popupCloseButton_margin\":\"0px\",\"popupCloseButton_action\":{\"name\":\"close_popup\",\"attrs\":{\"onClick\":\"document.querySelector(\'.u-popup-container\').style.display = \'none\';\"}},\"language\":{},\"backgroundColor\":\"#F7F8F9\",\"preheaderText\":\"\",\"linkStyle\":{\"body\":true,\"linkColor\":\"#0000ee\",\"linkHoverColor\":\"#0000ee\",\"linkUnderline\":true,\"linkHoverUnderline\":true},\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"accessibilityTitle\":\"\",\"_meta\":{\"htmlID\":\"u_body\",\"htmlClassNames\":\"u_body\"}}},\"schemaVersion\":24}','<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n<head>\n<!--[if gte mso 9]>\n<xml>\n  <o:OfficeDocumentSettings>\n    <o:AllowPNG/>\n    <o:PixelsPerInch>96</o:PixelsPerInch>\n  </o:OfficeDocumentSettings>\n</xml>\n<![endif]-->\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta name=\"x-apple-disable-message-reformatting\">\n  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n  \n  \n    <style type=\"text/css\">\n      \n      @media only screen and (min-width: 520px) {\n        .u-row {\n          width: 500px !important;\n        }\n\n        .u-row .u-col {\n          vertical-align: top;\n        }\n\n        \n            .u-row .u-col-50 {\n              width: 250px !important;\n            }\n          \n\n            .u-row .u-col-100 {\n              width: 500px !important;\n            }\n          \n      }\n\n      @media only screen and (max-width: 520px) {\n        .u-row-container {\n          max-width: 100% !important;\n          padding-left: 0px !important;\n          padding-right: 0px !important;\n        }\n\n        .u-row {\n          width: 100% !important;\n        }\n\n        .u-row .u-col {\n          display: block !important;\n          width: 100% !important;\n          min-width: 320px !important;\n          max-width: 100% !important;\n        }\n\n        .u-row .u-col > div {\n          margin: 0 auto;\n        }\n\n}\n    \nbody{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}\n\n\ntable, td { color: #000000; } </style>\n  \n  \n\n</head>\n\n<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F7F8F9;color: #000000\">\n  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n  <table role=\"presentation\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F7F8F9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n  <tbody>\n  <tr style=\"vertical-align: top\">\n    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n    <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #F7F8F9;\"><![endif]-->\n    \n  \n  \n<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n  <div class=\"u-row\" style=\"margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\">\n    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n      <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px;\"><tr style=\"background-color: transparent;\"><![endif]-->\n      \n<!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\"width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n    </div>\n  </div>\n  </div>\n  \n\n\n  \n  \n<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n  <div class=\"u-row\" style=\"margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\">\n    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n      <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px;\"><tr style=\"background-color: transparent;\"><![endif]-->\n      \n<!--[if (mso)|(IE)]><td align=\"center\" width=\"250\" style=\"width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n<!--[if (mso)|(IE)]><td align=\"center\" width=\"250\" style=\"width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n    </div>\n  </div>\n  </div>\n  \n\n\n    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n    </td>\n  </tr>\n  </tbody>\n  </table>\n  <!--[if mso]></div><![endif]-->\n  <!--[if IE]></div><![endif]-->\n</body>\n\n</html>\n','test2'),(3,'2026-03-29 17:48:37.738836','{\"counters\":{\"u_column\":3,\"u_row\":2},\"body\":{\"id\":\"dvv_rdALNA\",\"rows\":[{\"id\":\"TnPXe4QSBx\",\"cells\":[1],\"columns\":[{\"id\":\"44ZNIorr8M\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_1\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}}],\"values\":{\"displayCondition\":null,\"columns\":false,\"_styleGuide\":null,\"backgroundColor\":\"\",\"columnsBackgroundColor\":\"\",\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"padding\":\"0px\",\"anchor\":\"\",\"hideDesktop\":false,\"_meta\":{\"htmlID\":\"u_row_1\",\"htmlClassNames\":\"u_row\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false}},{\"id\":\"_8EOr540df\",\"cells\":[1,1],\"columns\":[{\"id\":\"squyhFm5oK\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_2\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}},{\"id\":\"RNICIrtZ2x\",\"contents\":[],\"values\":{\"backgroundColor\":\"\",\"padding\":\"0px\",\"border\":{},\"borderRadius\":\"0px\",\"_meta\":{\"htmlID\":\"u_column_3\",\"htmlClassNames\":\"u_column\"},\"deletable\":true,\"locked\":false}}],\"values\":{\"displayCondition\":null,\"columns\":false,\"_styleGuide\":null,\"backgroundColor\":\"\",\"columnsBackgroundColor\":\"\",\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\"},\"padding\":\"0px\",\"anchor\":\"\",\"_meta\":{\"htmlID\":\"u_row_2\",\"htmlClassNames\":\"u_row\"},\"selectable\":true,\"draggable\":true,\"duplicatable\":true,\"deletable\":true,\"hideable\":true,\"locked\":false}}],\"headers\":[],\"footers\":[],\"values\":{\"_styleGuide\":null,\"popupPosition\":\"center\",\"popupDisplayDelay\":0,\"popupWidth\":\"600px\",\"popupHeight\":\"auto\",\"borderRadius\":\"10px\",\"contentAlign\":\"center\",\"contentVerticalAlign\":\"middle\",\"contentWidth\":\"500px\",\"fontFamily\":{\"label\":\"Arial\",\"value\":\"arial,helvetica,sans-serif\"},\"textColor\":\"#000000\",\"popupBackgroundColor\":\"#FFFFFF\",\"popupBackgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"cover\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"popupOverlay_backgroundColor\":\"rgba(0, 0, 0, 0.1)\",\"popupCloseButton_position\":\"top-right\",\"popupCloseButton_backgroundColor\":\"#DDDDDD\",\"popupCloseButton_iconColor\":\"#000000\",\"popupCloseButton_borderRadius\":\"0px\",\"popupCloseButton_margin\":\"0px\",\"popupCloseButton_action\":{\"name\":\"close_popup\",\"attrs\":{\"onClick\":\"document.querySelector(\'.u-popup-container\').style.display = \'none\';\"}},\"language\":{},\"backgroundColor\":\"#F7F8F9\",\"preheaderText\":\"\",\"linkStyle\":{\"body\":true,\"linkColor\":\"#0000ee\",\"linkHoverColor\":\"#0000ee\",\"linkUnderline\":true,\"linkHoverUnderline\":true},\"backgroundImage\":{\"url\":\"\",\"fullWidth\":true,\"repeat\":\"no-repeat\",\"size\":\"custom\",\"position\":\"center\",\"customPosition\":[\"50%\",\"50%\"]},\"accessibilityTitle\":\"\",\"_meta\":{\"htmlID\":\"u_body\",\"htmlClassNames\":\"u_body\"}}},\"schemaVersion\":24}','<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n<head>\n<!--[if gte mso 9]>\n<xml>\n  <o:OfficeDocumentSettings>\n    <o:AllowPNG/>\n    <o:PixelsPerInch>96</o:PixelsPerInch>\n  </o:OfficeDocumentSettings>\n</xml>\n<![endif]-->\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta name=\"x-apple-disable-message-reformatting\">\n  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n  \n  \n    <style type=\"text/css\">\n      \n      @media only screen and (min-width: 520px) {\n        .u-row {\n          width: 500px !important;\n        }\n\n        .u-row .u-col {\n          vertical-align: top;\n        }\n\n        \n            .u-row .u-col-50 {\n              width: 250px !important;\n            }\n          \n\n            .u-row .u-col-100 {\n              width: 500px !important;\n            }\n          \n      }\n\n      @media only screen and (max-width: 520px) {\n        .u-row-container {\n          max-width: 100% !important;\n          padding-left: 0px !important;\n          padding-right: 0px !important;\n        }\n\n        .u-row {\n          width: 100% !important;\n        }\n\n        .u-row .u-col {\n          display: block !important;\n          width: 100% !important;\n          min-width: 320px !important;\n          max-width: 100% !important;\n        }\n\n        .u-row .u-col > div {\n          margin: 0 auto;\n        }\n\n}\n    \nbody{margin:0;padding:0}table,td,tr{border-collapse:collapse;vertical-align:top}.ie-container table,.mso-container table{table-layout:fixed}*{line-height:inherit}a[x-apple-data-detectors=true]{color:inherit!important;text-decoration:none!important}\n\n\ntable, td { color: #000000; } </style>\n  \n  \n\n</head>\n\n<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F7F8F9;color: #000000\">\n  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n  <table role=\"presentation\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F7F8F9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n  <tbody>\n  <tr style=\"vertical-align: top\">\n    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n    <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #F7F8F9;\"><![endif]-->\n    \n  \n  \n<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n  <div class=\"u-row\" style=\"margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\">\n    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n      <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px;\"><tr style=\"background-color: transparent;\"><![endif]-->\n      \n<!--[if (mso)|(IE)]><td align=\"center\" width=\"500\" style=\"width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n    </div>\n  </div>\n  </div>\n  \n\n\n  \n  \n<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n  <div class=\"u-row\" style=\"margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;\">\n    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n      <!--[if (mso)|(IE)]><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:500px;\"><tr style=\"background-color: transparent;\"><![endif]-->\n      \n<!--[if (mso)|(IE)]><td align=\"center\" width=\"250\" style=\"width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n<!--[if (mso)|(IE)]><td align=\"center\" width=\"250\" style=\"width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\" valign=\"top\"><![endif]-->\n<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;\">\n  <div style=\"height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\">\n  <!--[if (!mso)&(!IE)]><!--><div style=\"box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;\"><!--<![endif]-->\n  \n  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n  </div>\n</div>\n<!--[if (mso)|(IE)]></td><![endif]-->\n      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n    </div>\n  </div>\n  </div>\n  \n\n\n    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n    </td>\n  </tr>\n  </tbody>\n  </table>\n  <!--[if mso]></div><![endif]-->\n  <!--[if IE]></div><![endif]-->\n</body>\n\n</html>\n','SAV1');
/*!40000 ALTER TABLE `newsletter_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_items`
--

DROP TABLE IF EXISTS `portfolio_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_items` (
  `category_id` bigint DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `image_url` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('DRAFT','PUBLISHED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqqoc4jf6h79yf6h47vuitpcat` (`category_id`),
  CONSTRAINT `FKqqoc4jf6h79yf6h47vuitpcat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_items`
--

LOCK TABLES `portfolio_items` WRITE;
/*!40000 ALTER TABLE `portfolio_items` DISABLE KEYS */;
INSERT INTO `portfolio_items` VALUES (5,'2026-03-25 17:50:19.441223',1,'Un mariage intime sous les oliviers en Provence avec une décoration florale sobre et élégante.','/uploads/facd9d96-3d79-4dee-a7a7-0a073678e6cc.jpg','Provence','Mariage Champêtre Chic','PUBLISHED'),(6,'2026-03-25 17:50:19.441223',2,'Un mariage bohème dans un cadre naturel et romantique, avec arches en bois flotté et guirlandes de verdure.','/uploads/64113ce5-968a-4582-bb93-096c061e7705.jpg','Château de Loire','Mariage Bohème','PUBLISHED'),(7,'2026-03-25 17:50:19.441223',3,'Un mariage dans un loft parisien au décor industriel, revisité avec des touches dorées et végétales.','/uploads/92fb306f-d2b6-4217-a91e-7ffb4f29168e.jpg','Paris, Loft des Arts','Mariage Industriel Chic','PUBLISHED'),(8,'2026-03-25 17:50:19.441223',4,'Un anniversaire haut en couleurs pour les 7 ans d\'Inès, avec arche florale pastel et table de douceurs.','/uploads/625d63a1-8f46-4542-aee3-4a4760a38e18.jpg','Lyon','Anniversaire Féérique','PUBLISHED'),(9,'2026-03-25 17:50:19.441223',5,'Un dîner d\'exception pour les 50 ans d\'un client, orchestré dans un espace panoramique avec vue sur mer.','/uploads/9d7c210d-4dcb-4d38-9c3a-f7149c7f6dd1.jpg','Monaco','Dîner d\'Anniversaire Prestige','PUBLISHED'),(10,'2026-03-25 17:50:19.441223',6,'Une soirée de prestige au cœur de Paris avec 300 convives, nappes satin et chandeliers en cristal.','/uploads/f8aee074-1977-42f2-8b12-e15f60c95201.jpg','Paris','Le Gala du Crillon','PUBLISHED'),(10,'2026-03-25 17:50:19.441223',7,'Une soirée blanche exclusive sur la Côte d\'Azur avec décoration immaculée et fleurs blanches à profusion.','/uploads/ddf2e304-9fae-4312-9940-1b9fd5e225b2.jpg','Côte d\'Azur','Soirée Blanche','PUBLISHED');
/*!40000 ALTER TABLE `portfolio_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfolio_photos`
--

DROP TABLE IF EXISTS `portfolio_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfolio_photos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `display_order` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `portfolio_item_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK26wibg62d8i5273d9xag11uej` (`portfolio_item_id`),
  CONSTRAINT `FK26wibg62d8i5273d9xag11uej` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfolio_photos`
--

LOCK TABLES `portfolio_photos` WRITE;
/*!40000 ALTER TABLE `portfolio_photos` DISABLE KEYS */;
INSERT INTO `portfolio_photos` VALUES (4,'2026-03-29 20:41:11.179736',0,'/uploads/1d40c6ae-9958-4d77-8d62-90a66298df7d.jpeg',2),(6,'2026-03-29 20:41:11.253438',2,'/uploads/ca08c2b0-cdf8-4cd5-b001-e50fc55c916f.jpeg',2),(7,'2026-03-29 20:42:20.341953',2,'/uploads/47dc6a13-d4fc-4007-b10f-7baee41a777b.jpg',2),(8,'2026-03-29 21:11:15.628365',0,'/uploads/e1e286f8-b64f-48a2-8cf4-75d547951200.jpg',1),(9,'2026-03-29 21:11:15.663433',1,'/uploads/cb7c96f5-46fd-4400-977c-0339c222c3be.jpg',1),(10,'2026-03-29 21:11:15.699541',2,'/uploads/21c0cfdb-7e69-4c28-b681-31a9085a9451.jpg',1),(11,'2026-03-29 21:15:29.371300',0,'/uploads/b367594e-42d3-4ee0-b4da-f137c0e7ea98.webp',3),(12,'2026-03-29 21:15:29.412440',1,'/uploads/579383b9-54e3-4c18-8b52-8d9fb044b191.jpg',3),(13,'2026-03-29 21:15:29.452950',2,'/uploads/dcfc8bdf-7c7a-49cd-b091-578b4d5d8933.jpg',3),(14,'2026-03-29 21:16:02.606070',3,'/uploads/92fb306f-d2b6-4217-a91e-7ffb4f29168e.jpg',3);
/*!40000 ALTER TABLE `portfolio_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `budget` decimal(38,2) DEFAULT NULL,
  `event_date` date NOT NULL,
  `guest_count` int DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `message` text,
  `phone` varchar(255) DEFAULT NULL,
  `event_type` enum('MARIAGE','FETE_PRIVEE','ANNIVERSAIRE') NOT NULL,
  `status` enum('PENDING','CONFIRMED','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (50000.00,'2028-08-01',120,'2026-03-26 21:56:35.105230',1,'adriano.piazza.pa@gmail.com','Adriano','Piazza','qu\'en pense tu ? ','0799499154','MARIAGE','CONFIRMED');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` enum('ADMIN') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$10$eBx.KsxkqBZ4mnVp9CyzHuF3BamfUVbXyzGziB3BrzW2PZJzVrNEm','admin','ADMIN');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-29 21:56:38
