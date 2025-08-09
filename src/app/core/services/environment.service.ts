import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private _isElectron: boolean = false;
  private _apiBaseUrl: string = 'http://localhost:8080/api';
  private _isProduction: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Détecte si l'application s'exécute dans Electron
      this._isElectron = window && window.navigator && 
        /electron/i.test(window.navigator.userAgent);
      
      // Détecte si nous sommes en production (application packagée)
      this._isProduction = window.location.protocol === 'file:';
      
      // Si nous sommes en production et dans Electron, utiliser une URL différente
      if (this._isProduction && this._isElectron) {
        // Dans une application Electron packagée, nous continuons d'utiliser l'URL locale
        // car le backend est configuré pour accepter les requêtes de n'importe quelle origine
        this._apiBaseUrl = 'http://localhost:8080/api';
        console.log('Application en mode Electron production, utilisation de l\'URL API:', this._apiBaseUrl);
      } else {
        console.log('Application en mode développement, utilisation de l\'URL API locale:', this._apiBaseUrl);
      }
    }
  }

  /**
   * Vérifie si l'application s'exécute dans Electron
   */
  get isElectron(): boolean {
    return this._isElectron;
  }

  /**
   * Retourne l'URL de base de l'API en fonction de l'environnement
   */
  get apiBaseUrl(): string {
    return this._apiBaseUrl;
  }

  /**
   * Construit une URL d'API complète à partir d'un chemin relatif
   */
  getApiUrl(path: string): string {
    // Supprime le slash initial si présent pour éviter les doubles slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.apiBaseUrl}/${cleanPath}`;
  }
}