import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeRequest } from '../../models/employee.model';
import { AuthService } from '../../../auth/services/auth.service';
import { SweetAlertService } from '../../services/sweet-alert.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  employeeForm: FormGroup;
  isLoading = false;
  isModalOpen = false;
  isEditMode = false;
  currentEmployeeId: number | null = null;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  selectedPosition = '';

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private authService: AuthService,
    private sweetAlert: SweetAlertService
  ) {
    this.employeeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      poste: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dateEmbauche: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.checkTokenStatus();
    this.loadEmployees();
  }

  checkTokenStatus(): void {
    const tokenInfo = this.authService.getTokenInfo();
    console.log('=== DEBUG TOKEN ===');
    console.log('Token info:', tokenInfo);
    console.log('Is expired:', this.authService.isTokenExpired());
    console.log('Current time:', new Date());
    console.log('==================');
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.isLoading = false;
        
        this.sweetAlert.errorWithRetry(
          'Erreur de chargement !',
          'Impossible de charger la liste des employés. Veuillez réessayer.'
        ).then((result) => {
          if (result.isConfirmed) {
            this.loadEmployees();
          }
        });
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEmployeeId = null;
    this.employeeForm.reset();
    this.isModalOpen = true;
    this.clearMessages();
  }

  openEditModal(employee: Employee): void {
    this.isEditMode = true;
    this.currentEmployeeId = employee.id!;
    this.employeeForm.patchValue({
      nom: employee.nom,
      prenom: employee.prenom,
      poste: employee.poste,
      email: employee.email,
      dateEmbauche: employee.dateEmbauche
    });
    this.isModalOpen = true;
    this.clearMessages();
  }

  closeModal(): void {
    // Vérifier s'il y a des modifications non sauvegardées
    if (this.employeeForm.dirty) {
      this.sweetAlert.confirm(
        'Modifications non sauvegardées',
        'Voulez-vous vraiment fermer sans sauvegarder vos modifications ?',
        'Oui, fermer',
        'Continuer l\'édition'
      ).then((result) => {
        if (result.isConfirmed) {
          this.isModalOpen = false;
          this.employeeForm.reset();
          this.clearMessages();
        }
      });
    } else {
      this.isModalOpen = false;
      this.employeeForm.reset();
      this.clearMessages();
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employeeData: EmployeeRequest = this.employeeForm.value;
      
      if (this.isEditMode && this.currentEmployeeId) {
        this.updateEmployee(this.currentEmployeeId, employeeData);
      } else {
        this.createEmployee(employeeData);
      }
    } else {
      this.markFormGroupTouched();
      this.sweetAlert.warning(
        'Formulaire incomplet !',
        'Veuillez remplir tous les champs obligatoires correctement.'
      );
    }
  }

  createEmployee(employeeData: EmployeeRequest): void {
    this.isLoading = true;
    this.employeeService.createEmployee(employeeData).subscribe({
      next: (employee) => {
        this.employees.push(employee);
        this.filterEmployees();
        this.isModalOpen = false;
        this.employeeForm.reset();
        this.isLoading = false;
        
        this.sweetAlert.success(
          'Succès !',
          `L'employé ${employee.prenom} ${employee.nom} a été ajouté avec succès.`
        );
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        this.isLoading = false;
        
        let errorMessage = 'Une erreur est survenue lors de l\'ajout de l\'employé.';
        
        if (error.status === 403) {
          errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
        } else if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          errorMessage = 'Un employé avec cet email existe déjà.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        this.sweetAlert.error('Erreur !', errorMessage);
      }
    });
  }

  updateEmployee(id: number, employeeData: EmployeeRequest): void {
    this.isLoading = true;
    this.employeeService.updateEmployee(id, employeeData).subscribe({
      next: (updatedEmployee) => {
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index !== -1) {
          this.employees[index] = updatedEmployee;
        }
        this.filterEmployees();
        this.isModalOpen = false;
        this.employeeForm.reset();
        this.isLoading = false;
        
        this.sweetAlert.success(
          'Modifié !',
          `Les informations de ${updatedEmployee.prenom} ${updatedEmployee.nom} ont été mises à jour.`
        );
      },
      error: (error) => {
        console.error('Erreur lors de la modification:', error);
        this.isLoading = false;
        
        let errorMessage = 'Une erreur est survenue lors de la modification de l\'employé.';
        
        if (error.status === 404) {
          errorMessage = 'Employé non trouvé. Il a peut-être été supprimé.';
        } else if (error.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions pour modifier cet employé.';
        } else if (error.status === 400) {
          errorMessage = 'Données invalides. Vérifiez les informations saisies.';
        } else if (error.status === 409) {
          errorMessage = 'Un employé avec cet email existe déjà.';
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        this.sweetAlert.error('Erreur !', errorMessage);
      }
    });
  }

  deleteEmployee(employee: Employee): void {
    this.sweetAlert.confirmDelete(
      'Êtes-vous sûr ?',
      `Voulez-vous vraiment supprimer l'employé ${employee.prenom} ${employee.nom} ? Cette action est irréversible.`
    ).then((result) => {
      if (result.isConfirmed) {
        this.sweetAlert.showLoading('Suppression en cours...', 'Veuillez patienter');

        this.employeeService.deleteEmployee(employee.id!).subscribe({
          next: () => {
            this.employees = this.employees.filter(emp => emp.id !== employee.id);
            this.filterEmployees();
            
            this.sweetAlert.success(
              'Supprimé !',
              `L'employé ${employee.prenom} ${employee.nom} a été supprimé avec succès.`
            );
          },
          error: (error) => {
            console.error('Erreur lors de la suppression:', error);
            
            let errorMessage = 'Une erreur est survenue lors de la suppression de l\'employé.';
            
            // Gestion des différents types d'erreurs
            if (error.status === 404) {
              errorMessage = 'Employé non trouvé. Il a peut-être déjà été supprimé.';
            } else if (error.status === 403) {
              errorMessage = 'Vous n\'avez pas les permissions pour supprimer cet employé.';
            } else if (error.status === 500) {
              errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (typeof error.error === 'string') {
              errorMessage = error.error;
            }
            
            this.sweetAlert.error('Erreur !', errorMessage);
          }
        });
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Nouvelles méthodes pour le design amélioré
  filterEmployees(): void {
    let filtered = this.employees;

    // Filtrer par terme de recherche
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.nom.toLowerCase().includes(searchLower) ||
        emp.prenom.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.poste.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par poste
    if (this.selectedPosition) {
      filtered = filtered.filter(emp => emp.poste === this.selectedPosition);
    }

    this.filteredEmployees = filtered;
  }

  getActiveEmployees(): number {
    return this.employees.length; // Tous les employés sont considérés comme actifs pour le moment
  }

  getUniquePositions(): number {
    const positions = new Set(this.employees.map(emp => emp.poste));
    return positions.size;
  }

  getPositions(): string[] {
    const positions = new Set(this.employees.map(emp => emp.poste));
    return Array.from(positions).sort();
  }

  getInitials(nom: string, prenom: string): string {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  }

  trackByEmployeeId(index: number, employee: Employee): number {
    return employee.id || index;
  }

  // Getters pour la validation des champs
  get nom() { return this.employeeForm.get('nom'); }
  get prenom() { return this.employeeForm.get('prenom'); }
  get poste() { return this.employeeForm.get('poste'); }
  get email() { return this.employeeForm.get('email'); }
  get dateEmbauche() { return this.employeeForm.get('dateEmbauche'); }
}