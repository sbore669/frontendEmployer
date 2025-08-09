import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  // Configuration par défaut
  private defaultConfig = {
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#6c757d',
    reverseButtons: true
  };

  // Alerte de succès
  success(title: string, text: string, timer: number = 3000): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: this.defaultConfig.confirmButtonColor,
      timer,
      timerProgressBar: true
    });
  }

  // Alerte d'erreur
  error(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545'
    });
  }

  // Alerte d'avertissement
  warning(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ffc107'
    });
  }

  // Confirmation de suppression
  confirmDelete(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: this.defaultConfig.cancelButtonColor,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: this.defaultConfig.reverseButtons
    });
  }

  // Confirmation générale
  confirm(title: string, text: string, confirmText: string = 'Oui', cancelText: string = 'Annuler'): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: this.defaultConfig.confirmButtonColor,
      cancelButtonColor: this.defaultConfig.cancelButtonColor,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: this.defaultConfig.reverseButtons
    });
  }

  // Loader
  showLoading(title: string = 'Chargement...', text: string = 'Veuillez patienter'): void {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Fermer le loader
  closeLoading(): void {
    Swal.close();
  }

  // Alerte avec retry
  errorWithRetry(title: string, text: string): Promise<any> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Réessayer',
      confirmButtonColor: this.defaultConfig.confirmButtonColor,
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      cancelButtonColor: this.defaultConfig.cancelButtonColor
    });
  }
}