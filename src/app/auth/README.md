# Module Auth

Ce module contient tous les éléments liés à l'authentification de l'application.

## Structure

```
auth/
├── components/
│   ├── login/              # Composant de connexion
│   └── redirect/           # Composant de redirection automatique
├── services/
│   ├── auth.service.ts     # Service principal d'authentification
│   └── auth.interceptor.ts # Intercepteur HTTP pour les tokens
├── models/
│   └── auth.model.ts       # Interfaces TypeScript
├── guards/
│   └── auth.guard.ts       # Guard de protection des routes
└── index.ts                # Exports publics du module
```

## Composants

### LoginComponent
- Formulaire de connexion avec validation
- Gestion des erreurs d'authentification
- Redirection automatique après connexion

### RedirectComponent
- Gestion de la redirection initiale
- Vérification de l'état d'authentification

## Services

### AuthService
- Gestion de la connexion/déconnexion
- Stockage des tokens JWT
- Observable pour l'état utilisateur
- Compatible SSR

### AuthInterceptor
- Ajout automatique du token Bearer aux requêtes HTTP
- Gestion centralisée de l'authentification

## Guards

### AuthGuard
- Protection des routes nécessitant une authentification
- Redirection automatique vers login si non connecté

## Modèles

### LoginRequest
Interface pour les données de connexion

### LoginResponse
Interface pour la réponse du serveur

### User
Interface pour les données utilisateur