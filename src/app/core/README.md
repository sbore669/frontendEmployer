# Module Core

Ce module contient les composants principaux de l'application.

## Structure

```
core/
├── components/
│   ├── dashboard/          # Tableau de bord administrateur
│   └── employee/           # Gestion des employés
├── models/
│   └── employee.model.ts   # Modèles des employés
├── services/
│   └── employee.service.ts # Service de gestion des employés
└── index.ts                # Exports publics du module
```

## Composants

### DashboardComponent
- Interface d'administration moderne et responsive
- Sidebar avec navigation complète
- Cartes de statistiques animées
- Actions rapides
- Bouton de déconnexion intégré
- Compatible mobile avec sidebar collapsible

#### Fonctionnalités
- **Responsive Design** : S'adapte aux écrans mobiles et desktop
- **Sidebar Navigation** : Menu de navigation fixe avec icônes
- **Stats Cards** : Cartes colorées avec statistiques
- **Quick Actions** : Boutons d'actions rapides
- **User Info** : Affichage des informations utilisateur
- **Logout** : Bouton de déconnexion en bas de sidebar

### EmployeeComponent
- Gestion complète des employés (CRUD)
- Interface moderne avec tableau responsive
- Modals pour ajout/modification
- Validation des formulaires
- Messages de succès/erreur

#### Fonctionnalités
- **Liste des employés** : Tableau avec pagination et tri
- **Ajout d'employé** : Modal avec formulaire validé
- **Modification** : Édition en modal avec pré-remplissage
- **Suppression** : Confirmation avant suppression
- **Validation** : Validation en temps réel des champs
- **Messages** : Feedback utilisateur pour toutes les actions

#### API Endpoints
- `GET /api/employees` : Récupérer tous les employés
- `POST /api/employees` : Créer un nouvel employé
- `PUT /api/employees/:id` : Mettre à jour un employé
- `DELETE /api/employees/:id` : Supprimer un employé

## Services

### EmployeeService
- Service pour toutes les opérations CRUD sur les employés
- Gestion des requêtes HTTP avec authentification
- Gestion des erreurs et des réponses

## Modèles

### Employee
Interface pour les données d'un employé

### EmployeeRequest
Interface pour les requêtes de création/modification