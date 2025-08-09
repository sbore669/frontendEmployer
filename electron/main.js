const { app, BrowserWindow, session, dialog } = require('electron');
const http = require('http');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  });

  // En développement, charge l'app depuis le serveur Angular
  // En production, charge depuis les fichiers statiques
  let startUrl;
  if (process.env.ELECTRON_START_URL) {
    // Mode développement
    startUrl = process.env.ELECTRON_START_URL;
    console.log('Mode développement - Chargement depuis:', startUrl);
  } else {
    // Mode production - charger depuis les fichiers statiques
    startUrl = url.format({
      pathname: path.join(__dirname, '../dist/front-end-employee/browser/index.html'),
      protocol: 'file:',
      slashes: true
    });
    console.log('Mode production - Chargement depuis:', startUrl);
  }
  
  mainWindow.loadURL(startUrl);

  // Ouvre les DevTools en mode développement
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Fonction pour vérifier si le backend est accessible
function checkBackendConnection(url, callback) {
  const request = http.get(url, (res) => {
    if (res.statusCode === 200) {
      callback(true);
    } else {
      callback(false);
    }
  });
  
  request.on('error', (err) => {
    console.error('Erreur de connexion au backend:', err.message);
    callback(false);
  });
  
  request.setTimeout(5000, () => {
    request.abort();
    callback(false);
  });
}

app.on('ready', () => {
  // Configurer CORS pour être compatible avec le backend Spring Boot
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // Forcer l'origine à http://localhost:4200 pour correspondre à la configuration du backend
    // Le backend n'accepte que cette origine spécifique avec allowCredentials=true
    const origin = 'http://localhost:4200';
    
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // Utiliser l'origine spécifique pour être compatible avec allowCredentials=true
        'Access-Control-Allow-Origin': [origin],
        'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'Access-Control-Allow-Headers': ['Content-Type', 'Authorization', 'X-Requested-With'],
        'Access-Control-Allow-Credentials': ['true']
      }
    });
  });
  
  // Gérer les requêtes OPTIONS (preflight)
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    if (details.method === 'OPTIONS') {
      callback({cancel: false});
    } else {
      callback({cancel: false});
    }
  });


  // Intercepter les requêtes HTTP pour détecter les erreurs de connexion
  session.defaultSession.webRequest.onErrorOccurred((details) => {
    if (details.error === 'net::ERR_CONNECTION_REFUSED' && details.url.includes('localhost:8080')) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Erreur de connexion',
        message: 'Impossible de se connecter au serveur backend.',
        detail: 'Assurez-vous que le serveur backend est en cours d\'exécution sur http://localhost:8080.',
        buttons: ['OK']
      });
    }
  });

  createWindow();
  
  // Vérifier la connexion au backend après le démarrage
  checkBackendConnection('http://localhost:8080/api/auth', (isConnected) => {
    if (!isConnected && mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Information',
        message: 'Le serveur backend n\'est pas accessible.',
        detail: 'L\'application fonctionnera en mode hors ligne avec des données limitées.',
        buttons: ['OK']
      });
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});