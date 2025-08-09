import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InscriptionRequest, InscriptionAdminRequest } from '../../models/auth.model';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {
  inscriptionForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedRole: 'user' | 'admin' = 'user';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.inscriptionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.selectedRole === 'user') {
        // Inscription utilisateur normal
        const inscriptionData: InscriptionRequest = this.inscriptionForm.value;
        this.authService.inscription(inscriptionData).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Réponse inscription utilisateur:', response);
            
            // Vérifier si la réponse contient des mots-clés d'erreur
            if (typeof response === 'string' && response.toLowerCase().includes('error')) {
              this.errorMessage = 'Erreur lors de l\'inscription: ' + response;
            } else {
              this.successMessage = 'Inscription utilisateur réussie ! Redirection vers la page de connexion...';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            }
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        // Inscription administrateur
        const adminData: InscriptionAdminRequest = this.inscriptionForm.value;
        this.authService.addAdmin(adminData).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Réponse inscription admin:', response);
            
            // Vérifier si la réponse contient des mots-clés d'erreur
            if (typeof response === 'string' && response.toLowerCase().includes('error')) {
              this.errorMessage = 'Erreur lors de l\'inscription admin: ' + response;
            } else {
              this.successMessage = 'Inscription administrateur réussie ! Redirection vers la page de connexion...';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            }
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleError(error: any): void {
    this.isLoading = false;
    if (error.status === 409) {
      this.errorMessage = 'Ce nom d\'utilisateur ou cet email existe déjà';
    } else if (error.status === 400) {
      this.errorMessage = 'Données invalides. Vérifiez vos informations.';
    } else if (error.status === 403) {
      this.errorMessage = 'Accès refusé. Vous n\'avez pas les droits pour créer un administrateur.';
    } else {
      this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
    }
    console.error('Erreur d\'inscription:', error);
  }

  onRoleChange(role: 'user' | 'admin'): void {
    this.selectedRole = role;
    this.errorMessage = '';
    this.successMessage = '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.inscriptionForm.controls).forEach(key => {
      const control = this.inscriptionForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() { return this.inscriptionForm.get('username'); }
  get password() { return this.inscriptionForm.get('password'); }
  get email() { return this.inscriptionForm.get('email'); }

  goToLogin(): void {
    console.log('goToLogin appelée - Navigation vers /login');
    this.router.navigate(['/login']).then(() => {
      console.log('Navigation vers /login réussie');
    }).catch(error => {
      console.error('Erreur de navigation vers /login:', error);
    });
  }
} 