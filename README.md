# 🚀 Application de Gestion d'Employés

Application Angular avec support Electron pour la gestion des employés.

## 📋 Prérequis

- **Node.js** 18+ 
- **npm** 9+
- **Angular CLI** 19

## ⚡ Installation Rapide

```bash
# 1. Cloner le projet
git clone https://github.com/sbore669/frontendEmployer.git
cd frontEnd_employee

# 2. Installer les dépendances
npm install
```

## 🌐 Lancement Frontend (Navigateur)

### **Lancement Simple**
```bash
npm start
```
L'application sera accessible sur **http://localhost:4200**

### **Lancement avec Angular CLI**
```bash
ng serve
```

### **Options de Lancement**
```bash
# Port personnalisé
ng serve --port 4200

# Host externe (pour tester sur mobile)
ng serve --host 0.0.0.0

# Configuration spécifique
ng serve --configuration development
```

## 🖥️ Lancement ElectronJS (Desktop)

### **Lancement en Mode Développement**
```bash
npm run electron
```

### **Build Electron**
```bash
npm run electron:build
```

### **Lancement avec Options**
```bash
# Mode debug
npm run electron:debug

# Mode production
npm run electron:prod
```

## 🏗️ Build Production

### **Frontend Web**
```bash
npm run build
```
Les fichiers seront générés dans `dist/front-end-employee/`

### **Application Desktop**
```bash
npm run electron:build
```

## 🔧 Configuration Backend

L'application se connecte à l'API backend sur `http://localhost:8080/api/auth`

**Modifier l'URL :** `src/app/core/services/environment.service.ts`

## 🚨 Dépannage Rapide

### **Port 4200 déjà utilisé**
```bash
# Tuer le processus
lsof -ti:4200 | xargs kill -9

# Ou utiliser un autre port
npm start -- --port 4201
```

### **Angular CLI manquant**
```bash
npm install -g @angular/cli@19
```

### **Dépendances corrompues**
```bash
rm -rf node_modules package-lock.json
npm install
```

### **Problèmes Electron**
```bash
# Nettoyer le cache
npm run electron:clean

# Réinstaller les dépendances
npm install
```

## 📱 Commandes Utiles

| Commande | Description |
|----------|-------------|
| `npm start` | 🚀 Lancer l'application web |
| `npm run electron` | 🖥️ Lancer l'application desktop |
| `npm run build` | 🏗️ Build production web |
| `npm run electron:build` | 🖥️ Build production desktop |
| `npm test` | 🧪 Lancer les tests |
| `npm run lint` | 🔍 Vérifier le code |

## 🌟 Fonctionnalités

- ✅ **Authentification** avec JWT
- ✅ **Inscription** utilisateur et administrateur
- ✅ **Gestion des employés**
- ✅ **Interface responsive** Bootstrap 5
- ✅ **Support desktop** avec Electron
- ✅ **Composants standalone** Angular 19

## 📁 Structure du Projet

```
frontEnd_employee/
├── src/                    # Code source Angular
├── electron/              # Configuration Electron
├── package.json           # Dépendances et scripts
└── README.md             # Ce fichier
```

## 🚀 Démarrage Rapide

1. **Cloner** le projet
2. **Installer** : `npm install`
3. **Lancer web** : `npm start`
4. **Lancer desktop** : `npm run electron`
5. **C'est parti !** 🎉

---

**Développé avec Angular 19 + Electron**