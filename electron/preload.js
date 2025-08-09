// Fichier de préchargement pour Electron
const { contextBridge, ipcRenderer } = require('electron');

// Expose des API protégées aux fenêtres de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Vous pouvez ajouter ici des fonctions pour communiquer avec le processus principal
  // Par exemple:
  // sendMessage: (message) => ipcRenderer.send('message', message),
  // onResponse: (callback) => ipcRenderer.on('response', callback)
});