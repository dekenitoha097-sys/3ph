

DROP TABLE IF EXISTS `achat_dashboard_stats`;
/*!50001 DROP VIEW IF EXISTS `achat_dashboard_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `achat_dashboard_stats` AS SELECT 
 1 AS `total_composants`,
 1 AS `composants_disponibles`,
 1 AS `composants_indisponibles`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `admin_dashboard_stats`
--

DROP TABLE IF EXISTS `admin_dashboard_stats`;
/*!50001 DROP VIEW IF EXISTS `admin_dashboard_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `admin_dashboard_stats` AS SELECT 
 1 AS `total_demandes`,
 1 AS `demandes_en_attente`,
 1 AS `demandes_en_revision`,
 1 AS `demandes_en_cour_traitement`,
 1 AS `demandes_valide`,
 1 AS `demandes_transmis_labo`,
 1 AS `demandes_materiel_fourni`,
 1 AS `demandes_transmis_admin`,
 1 AS `demandes_commande_lancee`,
 1 AS `demandes_alternative_proposee`,
 1 AS `demandes_rejete`,
 1 AS `total_utilisateurs`,
 1 AS `total_etudiants`,
 1 AS `total_encadrants`,
 1 AS `total_laboratoire`,
 1 AS `total_admins`,
 1 AS `total_groupes`,
 1 AS `total_composants`,
 1 AS `quantite_totale_composants`,
 1 AS `composants_rupture_stock`,
 1 AS `composants_stock_faible`,
 1 AS `total_lignes_demande`,
 1 AS `lignes_disponibles`,
 1 AS `lignes_indisponibles`,
 1 AS `lignes_non_evaluees`,
 1 AS `total_historique`,
 1 AS `notifications_non_lues`,
 1 AS `notifications_lues`,
 1 AS `notifications_totales`,
 1 AS `encadrants_assignes`,
 1 AS `groupes_supervises`,
 1 AS `progression_moyenne_demandes`,
 1 AS `taux_completion_percent`,
 1 AS `taux_rejet_percent`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `composant`
--

DROP TABLE IF EXISTS `composant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `composant` (
  `id_composant` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(200) NOT NULL,
  `reference` varchar(100) NOT NULL COMMENT 'Référence unique du fournisseur',
  `photo_lien` varchar(500) DEFAULT NULL COMMENT 'URL ou chemin vers la photo du composant',
  `quantite` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Quantité en stock',
  `commentaire` text DEFAULT NULL COMMENT 'Notes techniques sur le composant',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `existe` tinyint(1) NOT NULL DEFAULT 1,
  `Statut_Disponibilite` enum('DIS','IND') DEFAULT 'DIS',
  PRIMARY KEY (`id_composant`),
  UNIQUE KEY `uk_reference` (`reference`),
  KEY `idx_reference` (`reference`),
  KEY `idx_nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `demande`
--

DROP TABLE IF EXISTS `demande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demande` (
  `id_demande` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `id_groupe` int(10) unsigned NOT NULL COMMENT 'Groupe au moment de la soumission (snapshot)',
  `id_status` int(10) unsigned NOT NULL DEFAULT 1,
  `id_etudiant` int(10) unsigned NOT NULL COMMENT 'Qui soumet la demande',
  `id_encadrant` int(10) unsigned DEFAULT NULL COMMENT 'Encadrant qui va traiter',
  `id_laboratoire` int(10) unsigned DEFAULT NULL COMMENT 'Laboratoire qui va traiter',
  `id_admin` int(10) unsigned DEFAULT NULL COMMENT 'Admin qui escalade si besoin',
  `date_soumission` datetime NOT NULL DEFAULT current_timestamp(),
  `date_modification` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `progression` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'Pourcentage de progression du traitement',
  PRIMARY KEY (`id_demande`),
  KEY `fk_dem_laboratoire` (`id_laboratoire`),
  KEY `fk_dem_admin` (`id_admin`),
  KEY `idx_dem_status` (`id_status`),
  KEY `idx_dem_etudiant` (`id_etudiant`),
  KEY `idx_dem_encadrant` (`id_encadrant`),
  KEY `idx_dem_groupe` (`id_groupe`),
  KEY `idx_dem_date` (`date_soumission`),
  CONSTRAINT `fk_dem_admin` FOREIGN KEY (`id_admin`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_dem_encadrant` FOREIGN KEY (`id_encadrant`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_dem_etudiant` FOREIGN KEY (`id_etudiant`) REFERENCES `utilisateur` (`id_utilisateur`),
  CONSTRAINT `fk_dem_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id_groupe`),
  CONSTRAINT `fk_dem_laboratoire` FOREIGN KEY (`id_laboratoire`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_dem_status` FOREIGN KEY (`id_status`) REFERENCES `status` (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`toha`@`%`*/ /*!50003 TRIGGER `tr_historique_auto`
AFTER UPDATE ON `demande`
FOR EACH ROW
BEGIN
    IF OLD.id_status <> NEW.id_status THEN
        INSERT INTO `historique`
            (id_demande, id_status_avant, id_status_apres, date_changement)
        VALUES
            (NEW.id_demande, OLD.id_status, NEW.id_status, NOW());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `discussion`
--

DROP TABLE IF EXISTS `discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion` (
  `id_discussion` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_demande` int(10) unsigned NOT NULL,
  `id_etudiant` int(10) unsigned NOT NULL,
  `id_encadrant` int(10) unsigned DEFAULT NULL,
  `auteur_type` enum('etudiant','encadrant') NOT NULL COMMENT 'Qui a envoyé le message',
  `auteur_id` int(10) unsigned NOT NULL COMMENT 'ID de l auteur (etudiant ou encadrant)',
  `message` text NOT NULL,
  `date_envoi` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_discussion`),
  KEY `fk_disc_etudiant` (`id_etudiant`),
  KEY `fk_disc_encadrant` (`id_encadrant`),
  KEY `fk_disc_auteur` (`auteur_id`),
  KEY `idx_disc_demande` (`id_demande`),
  KEY `idx_disc_date` (`id_demande`,`date_envoi`),
  KEY `idx_disc_auteur` (`auteur_type`,`auteur_id`),
  CONSTRAINT `fk_disc_auteur` FOREIGN KEY (`auteur_id`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_disc_demande` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`) ON DELETE CASCADE,
  CONSTRAINT `fk_disc_encadrant` FOREIGN KEY (`id_encadrant`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_disc_etudiant` FOREIGN KEY (`id_etudiant`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `encadrant_dashboard_stats`
--

DROP TABLE IF EXISTS `encadrant_dashboard_stats`;
/*!50001 DROP VIEW IF EXISTS `encadrant_dashboard_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `encadrant_dashboard_stats` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `total_demandes_supervisees`,
 1 AS `demandes_a_traiter`,
 1 AS `demandes_en_cours`,
 1 AS `demandes_validees`,
 1 AS `demandes_rejetees`,
 1 AS `demandes_completees`,
 1 AS `demandes_transmis_labo`,
 1 AS `demandes_alternative_proposee`,
 1 AS `taux_validation_percent`,
 1 AS `taux_rejet_percent`,
 1 AS `progression_moyenne_demandes`,
 1 AS `total_groupes_supervises`,
 1 AS `total_etudiants_supervises`,
 1 AS `notifications_non_lues`,
 1 AS `notifications_totales`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `encadrant_groupe`
--

DROP TABLE IF EXISTS `encadrant_groupe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encadrant_groupe` (
  `id_encadrant` int(10) unsigned NOT NULL,
  `id_groupe` int(10) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_encadrant`,`id_groupe`),
  KEY `idx_groupe` (`id_groupe`),
  CONSTRAINT `fk_eg_encadrant` FOREIGN KEY (`id_encadrant`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE,
  CONSTRAINT `fk_eg_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id_groupe`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `etudiant_dashboard_stats`
--

DROP TABLE IF EXISTS `etudiant_dashboard_stats`;
/*!50001 DROP VIEW IF EXISTS `etudiant_dashboard_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `etudiant_dashboard_stats` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `total_demandes`,
 1 AS `demandes_en_attente`,
 1 AS `demandes_en_revision`,
 1 AS `demandes_en_cour_traitement`,
 1 AS `demandes_valide`,
 1 AS `demandes_transmis_labo`,
 1 AS `demandes_materiel_fourni`,
 1 AS `demandes_transmis_admin`,
 1 AS `demandes_commande_lancee`,
 1 AS `demandes_alternative_proposee`,
 1 AS `demandes_rejete`,
 1 AS `demandes_en_cours`,
 1 AS `taux_completion_percent`,
 1 AS `taux_rejet_percent`,
 1 AS `progression_moyenne_demandes`,
 1 AS `total_composants_demandes`,
 1 AS `composants_disponibles`,
 1 AS `composants_indisponibles`,
 1 AS `composants_non_evalues`,
 1 AS `notifications_non_lues`,
 1 AS `notifications_totales`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `groupe`
--

DROP TABLE IF EXISTS `groupe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupe` (
  `id_groupe` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code_groupe` varchar(50) NOT NULL COMMENT 'Code unique attribué par l admin (ex: 2A-IA-2024)',
  `nom` varchar(255) DEFAULT NULL,
  `filiere` varchar(100) DEFAULT NULL COMMENT 'Filière (ex: Informatique, Electronique)',
  `annee` varchar(10) DEFAULT NULL COMMENT 'Année (ex: 1A, 2A, 3A)',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_groupe`),
  UNIQUE KEY `uk_code_groupe` (`code_groupe`),
  KEY `idx_code_groupe` (`code_groupe`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historique`
--

DROP TABLE IF EXISTS `historique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique` (
  `id_historique` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_demande` int(10) unsigned NOT NULL,
  `id_status_avant` int(10) unsigned DEFAULT NULL COMMENT 'NULL si première entrée',
  `id_status_apres` int(10) unsigned NOT NULL,
  `commentaire` text DEFAULT NULL,
  `date_changement` datetime NOT NULL DEFAULT current_timestamp(),
  `acteur_type` enum('etudiant','encadrant','laboratoire','admin') DEFAULT NULL,
  `acteur_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id_historique`),
  KEY `fk_hist_status_avant` (`id_status_avant`),
  KEY `fk_hist_status_apres` (`id_status_apres`),
  KEY `fk_hist_acteur` (`acteur_id`),
  KEY `idx_hist_demande` (`id_demande`),
  KEY `idx_hist_date` (`date_changement`),
  CONSTRAINT `fk_hist_acteur` FOREIGN KEY (`acteur_id`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE SET NULL,
  CONSTRAINT `fk_hist_demande` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`) ON DELETE CASCADE,
  CONSTRAINT `fk_hist_status_apres` FOREIGN KEY (`id_status_apres`) REFERENCES `status` (`id_status`),
  CONSTRAINT `fk_hist_status_avant` FOREIGN KEY (`id_status_avant`) REFERENCES `status` (`id_status`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `laboratoire_dashboard_stats`
--

DROP TABLE IF EXISTS `laboratoire_dashboard_stats`;
/*!50001 DROP VIEW IF EXISTS `laboratoire_dashboard_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `laboratoire_dashboard_stats` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `total_demandes_traitees`,
 1 AS `demandes_a_traiter`,
 1 AS `demandes_completees`,
 1 AS `demandes_transmis_admin`,
 1 AS `demandes_alternative_proposee`,
 1 AS `total_composants_demandes`,
 1 AS `composants_disponibles`,
 1 AS `composants_indisponibles`,
 1 AS `composants_non_evalues`,
 1 AS `taux_traitement_percent`,
 1 AS `taux_disponibilite_percent`,
 1 AS `progression_moyenne_demandes`,
 1 AS `notifications_non_lues`,
 1 AS `notifications_totales`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `ligne_demande`
--

DROP TABLE IF EXISTS `ligne_demande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_demande` (
  `id_ligne` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_demande` int(10) unsigned NOT NULL,
  `id_composant` int(10) unsigned NOT NULL,
  `quantite_demandee` int(10) unsigned NOT NULL CHECK (`quantite_demandee` > 0),
  `disponible` tinyint(1) DEFAULT NULL COMMENT 'Renseignée par le laboratoire : TRUE/FALSE/NULL',
  `commentaire_labo` text DEFAULT NULL COMMENT 'Raison de l indisponibilité si nécessaire',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_ligne`),
  UNIQUE KEY `uk_demande_composant` (`id_demande`,`id_composant`),
  KEY `idx_demande` (`id_demande`),
  KEY `idx_composant` (`id_composant`),
  CONSTRAINT `fk_lig_composant` FOREIGN KEY (`id_composant`) REFERENCES `composant` (`id_composant`),
  CONSTRAINT `fk_lig_demande` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id_notification` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_demande` int(10) unsigned DEFAULT NULL,
  `destinataire_type` enum('etudiant','encadrant','laboratoire','admin') NOT NULL,
  `id_destinataire` int(10) unsigned NOT NULL,
  `message` text NOT NULL,
  `date_envoi` datetime NOT NULL DEFAULT current_timestamp(),
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_notification`),
  KEY `fk_notif_demande` (`id_demande`),
  KEY `fk_notif_destinataire` (`id_destinataire`),
  KEY `idx_notif_destinataire` (`destinataire_type`,`id_destinataire`),
  KEY `idx_notif_lu` (`lu`),
  KEY `idx_notif_date` (`date_envoi`),
  CONSTRAINT `fk_notif_demande` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`) ON DELETE SET NULL,
  CONSTRAINT `fk_notif_destinataire` FOREIGN KEY (`id_destinataire`) REFERENCES `utilisateur` (`id_utilisateur`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id_status` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(100) NOT NULL COMMENT 'Valeur unique du statut',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_status`),
  UNIQUE KEY `uk_libelle` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL COMMENT 'Nom de l utilisateur',
  `prenom` varchar(100) DEFAULT NULL COMMENT 'Prénom de l utilisateur',
  `sexe` enum('Homme','Femme') DEFAULT NULL COMMENT 'Sexe de l utilisateur',
  `email` varchar(191) NOT NULL COMMENT 'Email unique (clé candidate)',
  `email_verified` tinyint(1) DEFAULT 0,
  `mot_de_passe` varchar(255) NOT NULL COMMENT 'Hash bcrypt',
  `id_groupe` int(10) unsigned DEFAULT NULL COMMENT 'NULL pour non-étudiants',
  `role` enum('etudiant','encadrant','laboratoire','admin','achat') NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `email_token` varchar(255) DEFAULT NULL,
  `email_token_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `fk_util_groupe` (`id_groupe`),
  KEY `idx_role` (`role`),
  KEY `idx_email` (`email`),
  KEY `idx_email_token` (`email_token`),
  CONSTRAINT `fk_util_groupe` FOREIGN KEY (`id_groupe`) REFERENCES `groupe` (`id_groupe`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vue_admins`
--

DROP TABLE IF EXISTS `vue_admins`;
/*!50001 DROP VIEW IF EXISTS `vue_admins`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vue_admins` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `email`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vue_encadrants`
--

DROP TABLE IF EXISTS `vue_encadrants`;
/*!50001 DROP VIEW IF EXISTS `vue_encadrants`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vue_encadrants` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `email`,
 1 AS `created_at`,
 1 AS `groupes_supervises`,
 1 AS `nb_groupes`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vue_etudiants_par_groupe`
--

DROP TABLE IF EXISTS `vue_etudiants_par_groupe`;
/*!50001 DROP VIEW IF EXISTS `vue_etudiants_par_groupe`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vue_etudiants_par_groupe` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `email`,
 1 AS `code_groupe`,
 1 AS `groupe`,
 1 AS `filiere`,
 1 AS `annee`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vue_laboratoire`
--

DROP TABLE IF EXISTS `vue_laboratoire`;
/*!50001 DROP VIEW IF EXISTS `vue_laboratoire`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vue_laboratoire` AS SELECT 
 1 AS `id_utilisateur`,
 1 AS `email`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `achat_dashboard_stats`
--

/*!50001 DROP VIEW IF EXISTS `achat_dashboard_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `achat_dashboard_stats` AS select count(0) AS `total_composants`,sum(`composant`.`Statut_Disponibilite` = 'DIS') AS `composants_disponibles`,sum(`composant`.`Statut_Disponibilite` = 'IND') AS `composants_indisponibles` from `composant` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `admin_dashboard_stats`
--

/*!50001 DROP VIEW IF EXISTS `admin_dashboard_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `admin_dashboard_stats` AS select (select count(0) from `demande`) AS `total_demandes`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_attente')) AS `demandes_en_attente`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_revision')) AS `demandes_en_revision`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_cour_de_traitement')) AS `demandes_en_cour_traitement`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'valide')) AS `demandes_valide`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'transmis_laboratoire')) AS `demandes_transmis_labo`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'materiel_fourni')) AS `demandes_materiel_fourni`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'transmis_administration')) AS `demandes_transmis_admin`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'commande_lancee')) AS `demandes_commande_lancee`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'alternative_proposee')) AS `demandes_alternative_proposee`,(select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) AS `demandes_rejete`,(select count(0) from `utilisateur`) AS `total_utilisateurs`,(select count(0) from `utilisateur` where `utilisateur`.`role` = 'etudiant') AS `total_etudiants`,(select count(0) from `utilisateur` where `utilisateur`.`role` = 'encadrant') AS `total_encadrants`,(select count(0) from `utilisateur` where `utilisateur`.`role` = 'laboratoire') AS `total_laboratoire`,(select count(0) from `utilisateur` where `utilisateur`.`role` = 'admin') AS `total_admins`,(select count(0) from `groupe`) AS `total_groupes`,(select count(0) from `composant`) AS `total_composants`,(select sum(`composant`.`quantite`) from `composant`) AS `quantite_totale_composants`,(select count(0) from `composant` where `composant`.`quantite` = 0) AS `composants_rupture_stock`,(select count(0) from `composant` where `composant`.`quantite` < 5) AS `composants_stock_faible`,(select count(0) from `ligne_demande`) AS `total_lignes_demande`,(select count(0) from `ligne_demande` where `ligne_demande`.`disponible` = 1) AS `lignes_disponibles`,(select count(0) from `ligne_demande` where `ligne_demande`.`disponible` = 0) AS `lignes_indisponibles`,(select count(0) from `ligne_demande` where `ligne_demande`.`disponible` is null) AS `lignes_non_evaluees`,(select count(0) from `historique`) AS `total_historique`,(select count(0) from `notification` where `notification`.`lu` = 0) AS `notifications_non_lues`,(select count(0) from `notification` where `notification`.`lu` = 1) AS `notifications_lues`,(select count(0) from `notification`) AS `notifications_totales`,(select count(distinct `encadrant_groupe`.`id_encadrant`) from `encadrant_groupe`) AS `encadrants_assignes`,(select count(distinct `encadrant_groupe`.`id_groupe`) from `encadrant_groupe`) AS `groupes_supervises`,(select avg(`demande`.`progression`) from `demande`) AS `progression_moyenne_demandes`,round((select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'materiel_fourni')) / case when (select count(0) from `demande`) > 0 then (select count(0) from `demande`) else 1 end * 100,2) AS `taux_completion_percent`,round((select count(0) from `demande` where `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) / case when (select count(0) from `demande`) > 0 then (select count(0) from `demande`) else 1 end * 100,2) AS `taux_rejet_percent` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `encadrant_dashboard_stats`
--

/*!50001 DROP VIEW IF EXISTS `encadrant_dashboard_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `encadrant_dashboard_stats` AS select `u`.`id_utilisateur` AS `id_utilisateur`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`) AS `total_demandes_supervisees`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` in (select `status`.`id_status` from `status` where `status`.`libelle` in ('en_attente','en_revision'))) AS `demandes_a_traiter`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` in (select `status`.`id_status` from `status` where `status`.`libelle` in ('en_cour_de_traitement','transmis_laboratoire'))) AS `demandes_en_cours`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'valide')) AS `demandes_validees`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) AS `demandes_rejetees`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'materiel_fourni')) AS `demandes_completees`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'transmis_laboratoire')) AS `demandes_transmis_labo`,(select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'alternative_proposee')) AS `demandes_alternative_proposee`,coalesce(round((select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'valide')) * 100.0 / case when (select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`) > 0 then (select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`) else 1 end,2),0) AS `taux_validation_percent`,coalesce(round((select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `d`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) * 100.0 / case when (select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`) > 0 then (select count(0) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`) else 1 end,2),0) AS `taux_rejet_percent`,coalesce((select avg(`d`.`progression`) from (`demande` `d` join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `d`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur`),0) AS `progression_moyenne_demandes`,(select count(distinct `eg`.`id_groupe`) from `encadrant_groupe` `eg` where `eg`.`id_encadrant` = `u`.`id_utilisateur`) AS `total_groupes_supervises`,(select count(distinct `ut`.`id_utilisateur`) from ((`utilisateur` `ut` join `groupe` `g` on(`g`.`id_groupe` = `ut`.`id_groupe`)) join `encadrant_groupe` `eg` on(`eg`.`id_groupe` = `g`.`id_groupe`)) where `eg`.`id_encadrant` = `u`.`id_utilisateur` and `ut`.`role` = 'etudiant') AS `total_etudiants_supervises`,(select count(0) from `notification` where `notification`.`id_destinataire` = `u`.`id_utilisateur` and `notification`.`lu` = 0) AS `notifications_non_lues`,(select count(0) from `notification` where `notification`.`id_destinataire` = `u`.`id_utilisateur`) AS `notifications_totales` from `utilisateur` `u` where `u`.`role` = 'encadrant' */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `etudiant_dashboard_stats`
--

/*!50001 DROP VIEW IF EXISTS `etudiant_dashboard_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `etudiant_dashboard_stats` AS select `u`.`id_utilisateur` AS `id_utilisateur`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`) AS `total_demandes`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_attente')) AS `demandes_en_attente`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_revision')) AS `demandes_en_revision`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'en_cour_de_traitement')) AS `demandes_en_cour_traitement`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'valide')) AS `demandes_valide`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'transmis_laboratoire')) AS `demandes_transmis_labo`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'materiel_fourni')) AS `demandes_materiel_fourni`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'transmis_administration')) AS `demandes_transmis_admin`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'commande_lancee')) AS `demandes_commande_lancee`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'alternative_proposee')) AS `demandes_alternative_proposee`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) AS `demandes_rejete`,(select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and !(`demande`.`id_status` in (select `status`.`id_status` from `status` where `status`.`libelle` in ('materiel_fourni','rejete')))) AS `demandes_en_cours`,coalesce(round((select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'materiel_fourni')) * 100.0 / case when (select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`) > 0 then (select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`) else 1 end,2),0) AS `taux_completion_percent`,coalesce(round((select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur` and `demande`.`id_status` = (select `status`.`id_status` from `status` where `status`.`libelle` = 'rejete')) * 100.0 / case when (select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`) > 0 then (select count(0) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`) else 1 end,2),0) AS `taux_rejet_percent`,coalesce((select avg(`demande`.`progression`) from `demande` where `demande`.`id_etudiant` = `u`.`id_utilisateur`),0) AS `progression_moyenne_demandes`,(select count(distinct `ld`.`id_composant`) from (`ligne_demande` `ld` join `demande` `d` on(`d`.`id_demande` = `ld`.`id_demande`)) where `d`.`id_etudiant` = `u`.`id_utilisateur`) AS `total_composants_demandes`,(select count(0) from (`ligne_demande` `ld` join `demande` `d` on(`d`.`id_demande` = `ld`.`id_demande`)) where `d`.`id_etudiant` = `u`.`id_utilisateur` and `ld`.`disponible` = 1) AS `composants_disponibles`,(select count(0) from (`ligne_demande` `ld` join `demande` `d` on(`d`.`id_demande` = `ld`.`id_demande`)) where `d`.`id_etudiant` = `u`.`id_utilisateur` and `ld`.`disponible` = 0) AS `composants_indisponibles`,(select count(0) from (`ligne_demande` `ld` join `demande` `d` on(`d`.`id_demande` = `ld`.`id_demande`)) where `d`.`id_etudiant` = `u`.`id_utilisateur` and `ld`.`disponible` is null) AS `composants_non_evalues`,(select count(0) from `notification` where `notification`.`id_destinataire` = `u`.`id_utilisateur` and `notification`.`lu` = 0) AS `notifications_non_lues`,(select count(0) from `notification` where `notification`.`id_destinataire` = `u`.`id_utilisateur`) AS `notifications_totales` from `utilisateur` `u` where `u`.`role` = 'etudiant' */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `laboratoire_dashboard_stats`
--

/*!50001 DROP VIEW IF EXISTS `laboratoire_dashboard_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `laboratoire_dashboard_stats` AS select 1 AS `id_utilisateur`,(select count(0) from `demande`) AS `total_demandes_traitees`,(select count(0) from (`demande` `d` join `status` `s` on(`s`.`id_status` = `d`.`id_status`)) where `s`.`libelle` = 'en_attente') AS `demandes_a_traiter`,(select count(0) from (`demande` `d` join `status` `s` on(`s`.`id_status` = `d`.`id_status`)) where `s`.`libelle` = 'valide') AS `demandes_completees`,(select count(0) from (`demande` `d` join `status` `s` on(`s`.`id_status` = `d`.`id_status`)) where `s`.`libelle` = 'pret') AS `demandes_transmis_admin`,(select count(0) from (`demande` `d` join `status` `s` on(`s`.`id_status` = `d`.`id_status`)) where `s`.`libelle` = 'en_revision') AS `demandes_alternative_proposee`,(select count(distinct `ld`.`id_composant`) from `ligne_demande` `ld`) AS `total_composants_demandes`,(select count(0) from `ligne_demande` `ld` where `ld`.`disponible` = 1) AS `composants_disponibles`,(select count(0) from `ligne_demande` `ld` where `ld`.`disponible` = 0) AS `composants_indisponibles`,(select count(0) from `ligne_demande` `ld` where `ld`.`disponible` is null) AS `composants_non_evalues`,coalesce(round((select count(0) from (`demande` `d` join `status` `s` on(`s`.`id_status` = `d`.`id_status`)) where `s`.`libelle` = 'valide') * 100.0 / nullif((select count(0) from `demande`),0),2),0) AS `taux_traitement_percent`,coalesce(round((select count(0) from `ligne_demande` where `ligne_demande`.`disponible` = 1) * 100.0 / nullif((select count(0) from `ligne_demande`),0),2),0) AS `taux_disponibilite_percent`,coalesce((select avg(`demande`.`progression`) from `demande`),0) AS `progression_moyenne_demandes`,(select count(0) from `notification` where `notification`.`lu` = 0) AS `notifications_non_lues`,(select count(0) from `notification`) AS `notifications_totales` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vue_admins`
--

/*!50001 DROP VIEW IF EXISTS `vue_admins`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vue_admins` AS select `u`.`id_utilisateur` AS `id_utilisateur`,`u`.`email` AS `email`,`u`.`created_at` AS `created_at` from `utilisateur` `u` where `u`.`role` = 'admin' order by `u`.`email` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vue_encadrants`
--

/*!50001 DROP VIEW IF EXISTS `vue_encadrants`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vue_encadrants` AS select `u`.`id_utilisateur` AS `id_utilisateur`,`u`.`email` AS `email`,`u`.`created_at` AS `created_at`,group_concat(distinct concat(`g`.`code_groupe`,' (',`g`.`nom`,')') separator ', ') AS `groupes_supervises`,count(distinct `eg`.`id_groupe`) AS `nb_groupes` from ((`utilisateur` `u` left join `encadrant_groupe` `eg` on(`eg`.`id_encadrant` = `u`.`id_utilisateur`)) left join `groupe` `g` on(`g`.`id_groupe` = `eg`.`id_groupe`)) where `u`.`role` = 'encadrant' group by `u`.`id_utilisateur`,`u`.`email`,`u`.`created_at` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vue_etudiants_par_groupe`
--

/*!50001 DROP VIEW IF EXISTS `vue_etudiants_par_groupe`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vue_etudiants_par_groupe` AS select `u`.`id_utilisateur` AS `id_utilisateur`,`u`.`email` AS `email`,`g`.`code_groupe` AS `code_groupe`,`g`.`nom` AS `groupe`,`g`.`filiere` AS `filiere`,`g`.`annee` AS `annee`,`u`.`created_at` AS `created_at` from (`utilisateur` `u` join `groupe` `g` on(`g`.`id_groupe` = `u`.`id_groupe`)) where `u`.`role` = 'etudiant' order by `g`.`code_groupe`,`u`.`email` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vue_laboratoire`
--

/*!50001 DROP VIEW IF EXISTS `vue_laboratoire`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`toha`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `vue_laboratoire` AS select `u`.`id_utilisateur` AS `id_utilisateur`,`u`.`email` AS `email`,`u`.`created_at` AS `created_at` from `utilisateur` `u` where `u`.`role` = 'laboratoire' order by `u`.`email` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-03 12:13:03
