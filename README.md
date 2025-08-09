# Application de Gestion d'Employés - Frontend

Cette application Angular permet de gérer les employés avec un système d'authentification intégré.

## Fonctionnalités

- ✅ Authentification avec JWT
- ✅ Interface utilisateur avec Bootstrap
- ✅ Dashboard avec statistiques
- ✅ Protection des routes avec AuthGuard
- ✅ Gestion des tokens et localStorage
- ✅ Compatible SSR (Server-Side Rendering)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer l'application :
```bash
ng serve
```

L'application sera accessible sur `http://localhost:4200`

## Configuration Backend

L'application est configurée pour se connecter à l'API backend sur `http://localhost:8080/api/auth`

Pour modifier l'URL du backend, éditer le fichier `src/app/services/auth.service.ts` :

```typescript
private apiUrl = 'http://localhost:8080/api/auth'; // Modifier cette URL
```

## Authentification

### Endpoint de connexion
```
POST /api/auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123"
}
```

### Réponse attendue
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "username": "john_doe",
    "email": "john@example.com"
}
```

## Structure du projet

```
src/
├── app/
│   ├── auth/                    # Module d'authentification
│   │   ├── components/
│   │   │   ├── login/           # Composant de connexion
│   │   │   └── redirect/        # Gestion de la redirection
│   │   ├── services/
│   │   │   ├── auth.service.ts  # Service d'authentification
│   │   │   └── auth.interceptor.ts # Intercepteur HTTP
│   │   ├── models/
│   │   │   └── auth.model.ts    # Modèles TypeScript
│   │   ├── guards/
│   │   │   └── auth.guard.ts    # Protection des routes
│   │   └── index.ts             # Exports du module auth
│   ├── core/                    # Module principal
│   │   ├── components/
│   │   │   └── dashboard/       # Tableau de bord principal
│   │   └── index.ts             # Exports du module core
│   └── app.routes.ts            # Configuration des routes
```

### Organisation modulaire

- **auth/** : Tout ce qui concerne l'authentification (login, services, guards, etc.)
- **core/** : Composants principaux de l'application (dashboard, etc.)
- **index.ts** : Fichiers d'export pour simplifier les imports

## Utilisation

1. **Page de connexion** : Accessible sur `/login`
   - Saisir nom d'utilisateur et mot de passe
   - Validation des champs obligatoires
   - Gestion des erreurs d'authentification

2. **Dashboard** : Accessible sur `/dashboard` (protégé)
   - Affichage des statistiques
   - Menu de navigation
   - Bouton de déconnexion

3. **Redirection automatique** :
   - Si connecté : redirection vers `/dashboard`
   - Si non connecté : redirection vers `/login`

## Technologies utilisées

- **Angular 19** - Framework frontend
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Icônes
- **RxJS** - Programmation réactive
- **TypeScript** - Langage de programmation

## Développement

Pour ajouter de nouvelles fonctionnalités :

1. **Nouveaux composants** :
```bash
ng generate component components/nom-composant
```

2. **Nouveaux services** :
```bash
ng generate service services/nom-service
```

3. **Nouvelles routes** :
Modifier `src/app/app.routes.ts`

## Build de production

```bash
ng build --configuration production
```

Les fichiers de build seront générés dans le dossier `dist/`.