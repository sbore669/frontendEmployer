import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private _electronAPI: any;

  constructor() {
    // Vérifie si l'application est exécutée dans Electron
    // La propriété isElectron vérifie déjà si nous sommes dans un environnement navigateur
    if (this.isElectron) {
      this._electronAPI = (window as any).electronAPI;
    }
  }

  /**
   * Vérifie si l'application est exécutée dans Electron
   */
  get isElectron(): boolean {
    // Vérifier si nous sommes dans un environnement navigateur avant d'accéder à window
    const isBrowser = typeof window !== 'undefined';
    return !!(isBrowser && (window as any).electronAPI);
  }

  /**
   * Accès à l'API Electron
   */
  get electronAPI(): any {
    return this._electronAPI;
  }
}