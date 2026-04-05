# Guide du Dashboard - HESTIM Système de Gestion des Demandes

## Vue d'ensemble
Ce document décrit les fonctionnalités et l'affichage du dashboard pour chaque type d'utilisateur dans le système de gestion des demandes de composants académiques.

---

## 📚 ÉTUDIANT

### Accès
- **URL**: `/dashboard/student`
- **Authentification**: Email @hestim.ma + mot de passe

### Fonctionnalités principales

#### 1. **Tableau de Bord Général**
- Bienvenue personnalisée avec prénom
- Card "Mes Demandes Rapides"
- Statistiques en direct:
  - Total demandes
  - Demandes en attente
  - Demandes approuvées
  - Demandes rejetées

#### 2. **Nouvelle Demande**
- Bouton CTA "Créer une Demande"
- Formulaire:
  - Sélection du composant (dropdown avec recherche)
  - Quantité
  - Justification/Description
  - Date souhaitée
  - Fichiers joints (devis, schéma, etc.)
  - Priorité (Normale/Urgente)

#### 3. **Historique des Demandes**
- Tableau avec colonnes:
  - Référence (ID demande)
  - Composant
  - Quantité
  - Date de création
  - Statut (couleurs: En attente=Orange, Approuvée=Vert, Rejetée=Rouge)
  - Actions (Voir détails, Télécharger facture)
- Filtres: Statut, Date, Priorité
- Pagination

#### 4. **Détails d'une Demande**
- Informations complètes
- Timeline de suivi:
  - Création → Examen → Approbation → Livraison
- Commentaires encadrant
- Documents joints
- Traces d'audit

#### 5. **Notifications**
- Top-right corner
- Nouvelles mises à jour sur demandes
- Demandes approuvées/rejetées

#### 6. **Profil**
- Modifier informations (nom, prénom, sexe)
- Changer mot de passe
- Déconnexion

---

## 🎓 ENCADRANT

### Accès
- **URL**: `/dashboard/supervisor`
- **Authentification**: Email @hestim.ma + mot de passe

### Fonctionnalités principales

#### 1. **Tableau de Bord Général**
- Vue d'ensemble des demandes des étudiants encadrés
- Statistiques:
  - Total demandes des étudiants
  - En attente d'approbation encadrant
  - Approuvées
  - Rejetées
  - Montant total approuvé

#### 2. **Demandes à Examiner**
- Liste des demandes en attente d'approbation
- Tableau avec:
  - Étudiant (nom, prénom)
  - Composant
  - Quantité & Budget
  - Date création
  - Justification
  - Actions (Approuver/Rejeter, Voir détails)

#### 3. **Approver/Rejeter une Demande**
- Modal avec:
  - Détails complets
  - Option commentaire perso
  - Budget check (avertissement si dépassement)
  - Boutons: "Approuver" / "Rejeter"
  - Choix: avec/sans commentaire

#### 4. **Historique de Validation**
- Toutes les demandes traitées
- Filtres: Statut, Date, Étudiant
- Colonnes: Étudiant, Composant, Décision, Date, Commentaire

#### 5. **Mes Étudiants**
- Liste des étudiants encadrés
- Par étudiant:
  - Total demandes
  - Budget utilisé
  - Statut global

#### 6. **Rapports**
- Export CSV des demandes approuvées
- Rapport budgétaire par étudiant
- Statistiques périodiques

---

## 🔬 LABORATOIRE

### Accès
- **URL**: `/dashboard/lab`
- **Authentification**: Email @hestim.ma + mot de passe

### Fonctionnalités principales

#### 1. **Tableau de Bord Général**
- Vue des demandes approuvées à commander
- Statistiques:
  - Demandes approuvées en attente commande
  - En cours de commande
  - Livrées
  - Budget dépensé

#### 2. **Demandes à Commander**
- Tableau des demandes approuvées (par encadrants/admin)
- Colonnes:
  - Référence demande
  - Étudiant/Encadrant
  - Composant
  - Quantité
  - Budget
  - Date d'approbation
  - Actions (Marquer en commande, Ajouter fournisseur)

#### 3. **Gestion des Commandes**
- Créer/enregistrer commande:
  - Sélectionner demande(s)
  - Fournisseur
  - Référence commande externe
  - Prix réel
  - Date livraison prévue
  - Numéro suivi (tracking)

#### 4. **Suivi de Livraison**
- Liste des commandes:
  - Statut: En commande / En transit / Livrée
  - Fournisseur
  - Date livraison
  - Documents (factures, BOL)
  - Actions (Marquer livré, Télécharger docs)

#### 5. **Réception/Stockage**
- Demandes livrées en attente réception
- Formulaire réception:
  - Vérification quantité
  - Photo/Inspection
  - Localisation stockage
  - Signature numérique

#### 6. **Rapports & Inventaire**
- État des commandes
- Budget vs dépenses réelles
- Historique fournisseurs
- Export documents de commande

---

## 🛡️ ADMINISTRATEUR

### Accès
- **URL**: `/dashboard/admin`
- **Authentification**: Email @hestim.ma + mot de passe

### Fonctionnalités principales

#### 1. **Tableau de Bord Global**
- Vue complète du système
- Statistiques globales:
  - Total demandes (tous statuts)
  - Utilisateurs actifs
  - Budget total
  - Dépenses réelles vs budget

#### 2. **Gestion des Utilisateurs**
- Liste complète (Étudiants, Encadrants, Labo, Admins)
- Par utilisateur:
  - Nom, Email, Rôle
  - Statut (Actif/Inactif)
  - Date création
  - Actions:
    - Éditer profil
    - Activer/Désactiver
    - Changer rôle
    - Réinitialiser mot de passe
    - Supprimer

#### 3. **Créer nouvel utilisateur**
- Formulaire:
  - Nom, Prénom, Genre
  - Email @hestim.ma
  - Rôle (Étudiant/Encadrant/Labo/Admin)
  - Mot de passe temporaire (envoyé par email)
  - Groupement (équipe/département)

#### 4. **Validation des Demandes**
- Demandes approuvées encadrant, en attente validation admin
- Options:
  - Approuver finale
  - Demander modification
  - Rejeter avec justification
  - Fixer limites budgétaires

#### 5. **Gestion des Composants**
- Catalogue des composants:
  - Nom, Description
  - Catégorie
  - Prix unitaire
  - Stock
  - Fournisseur par défaut
  - Actions (Ajouter/Modifier/Supprimer)

#### 6. **Fournisseurs**
- Liste des fournisseurs:
  - Nom, Contact
  - Email/Téléphone
  - Composants proposés
  - Délai livraison moyen
  - Fiabilité (rating)

#### 7. **Budgets & Limites**
- Configuration budgets:
  - Budget global par année
  - Limites par étudiant
  - Limites par catégorie de composant
  - Limites par priorité

#### 8. **Rapports & Analytics**
- Tableau de bord complet:
  - Évolution demandes (graphe)
  - Évolution budget (graphe)
  - Top composants demandés
  - Top fournisseurs
  - Temps de traitement moyen
- Export rapports (PDF, Excel):
  - Rapport complet par période
  - Rapport budgétaire
  - Rapport utilisateurs

#### 9. **Audit & Logs**
- Historique des actions:
  - Qui, Quand, Quoi, Statut
  - Modifications de demandes
  - Changements utilisateurs
  - Changements de configuration

#### 10. **Configuration Système**
- Paramètres globaux:
  - Délai approbation (notification)
  - Seuils d'alerte budget
  - Formats export
  - Emails système

---

## 🎨 Design Commun

### Éléments partagés
- Header avec logo HESTIM
- Navigation latérale (sidebar) avec menu contextuel
- Notifications en temps réel (coin supérieur)
- Footer avec copyright
- Barre de recherche globale
- Thème: Bleu marine (#001A4D) + Rouge (#E63946) + Vert (#2A9D8F) + Orange (#F4A261)

### Responsive
- Desktop: Layout complet
- Tablette: Sidebar collapsible
- Mobile: Menu hamburger, dashboard réduit

---

## 🔐 Sécurité

- **Authentification**: JWT Token (7 jours)
- **Autorisation**: Vérification rôle sur chaque page
- **Données sensibles**: Masquage possibles (emails, budgets)
- **Audit**: Toutes les actions enregistrées

---

## 📋 Statuts des Demandes

1. **Brouillon** (Étudiant) - Création en cours
2. **En attente approbation encadrant** (Encadrant) - À examiner
3. **Rejetée (Encadrant)** - Refusée, modifiable
4. **Approuvée (Encadrant)** - En attente validate admin
5. **En attente validation admin** (Admin) - À vérifier
6. **Approuvée (Admin)** - Valide, envoyée au labo
7. **En commande** (Labo) - Commande passée
8. **En transit** (Labo) - En livraison
9. **Reçue** (Labo) - Stockage effectué
10. **Fermée** - Processus terminé

---

## 📧 Notifications Types

- Nouvelle demande créée (Encadrant)
- Demande en attente approbation (Encadrant)
- Demande approuvée/rejetée (Étudiant)
- Commande passée (Admin, Labo)
- Livraison imminente (Labo)
- Dépassement budget (Admin)
- Modification demande (Encadrant)

---

## 📚 API Endpoints Nécessaires

```
POST   /api/demands              - Créer demande
GET    /api/demands              - Lister demandes (filtrées par rôle)
GET    /api/demands/:id          - Détail demande
PUT    /api/demands/:id          - Modifier demande
PUT    /api/demands/:id/approve  - Approuver demande
PUT    /api/demands/:id/reject   - Rejeter demande

GET    /api/users                - Lister utilisateurs
POST   /api/users                - Créer utilisateur
PUT    /api/users/:id            - Modifier utilisateur
DELETE /api/users/:id            - Supprimer utilisateur

GET    /api/components           - Lister composants
POST   /api/components           - Ajouter composant
PUT    /api/components/:id       - Modifier composant

GET    /api/suppliers            - Lister fournisseurs
POST   /api/suppliers            - Ajouter fournisseur

GET    /api/orders               - Lister commandes
POST   /api/orders               - Créer commande

GET    /api/analytics            - Statistiques & rapports
GET    /api/audit                - Logs audit
```

---

## 🎯 Prochaines Étapes

1. Créer les pages composants pour chaque dashboard
2. Implémenter les API endpoints
3. Gérer les states & permissions
4. Intégrer les graphes & charts
5. Tester l'authentification & autorisation
6. Déployer & monitorer

