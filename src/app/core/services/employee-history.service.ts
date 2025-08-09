import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { EmployeeHistory } from '../models/employee-history.model';
import { AuthService } from '../../auth/services/auth.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryService {
  private apiUrl: string;
  
  // Données fictives pour la démonstration
  // Données fictives accessibles pour le fallback
  mockHistory: EmployeeHistory[] = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Dupont Jean',
      action: 'CREATE',
      timestamp: '2025-08-09T10:30:00',
      details: 'Création du profil employé',
      modifiedBy: 'Admin'
    },
    {
      id: 2,
      employeeId: 1,
      employeeName: 'Dupont Jean',
      action: 'UPDATE',
      timestamp: '2025-08-09T14:15:00',
      details: 'Mise à jour du poste: Développeur Senior -> Architecte',
      modifiedBy: 'Admin'
    },
    {
      id: 3,
      employeeId: 2,
      employeeName: 'Martin Sophie',
      action: 'CREATE',
      timestamp: '2025-08-09T11:45:00',
      details: 'Création du profil employé',
      modifiedBy: 'Admin'
    },
    {
      id: 4,
      employeeId: 3,
      employeeName: 'Petit Marc',
      action: 'CREATE',
      timestamp: '2025-08-09T13:20:00',
      details: 'Création du profil employé',
      modifiedBy: 'Admin'
    },
    {
      id: 5,
      employeeId: 3,
      employeeName: 'Petit Marc',
      action: 'DELETE',
      timestamp: '2025-08-09T16:05:00',
      details: 'Suppression du profil employé',
      modifiedBy: 'Admin'
    }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.getApiUrl('employees/history');
  }

  // Obtenir les en-têtes HTTP avec le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    // Récupérer le token depuis le service d'authentification
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Récupérer tout l'historique
  getEmployeeHistory(): Observable<EmployeeHistory[]> {
    // Utilisation de l'API réelle avec authentification
    return this.http.get<EmployeeHistory[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
  
  // Méthode de fallback pour utiliser les données fictives
  getMockEmployeeHistory(): Observable<EmployeeHistory[]> {
    return of(this.mockHistory);
  }

  // Récupérer l'historique d'un employé spécifique
  getEmployeeHistoryById(employeeId: number): Observable<EmployeeHistory[]> {
    return this.http.get<EmployeeHistory[]>(`${this.apiUrl}/employee/${employeeId}`, { headers: this.getAuthHeaders() });
  }
  
  // Méthode de fallback pour récupérer l'historique d'un employé spécifique
  getMockEmployeeHistoryById(employeeId: number): Observable<EmployeeHistory[]> {
    const filteredHistory = this.mockHistory.filter(h => h.employeeId === employeeId);
    return of(filteredHistory);
  }

  // Ajouter une entrée d'historique
  addHistoryEntry(entry: EmployeeHistory): Observable<EmployeeHistory> {
    return this.http.post<EmployeeHistory>(this.apiUrl, entry, { headers: this.getAuthHeaders() });
  }
  
  // Méthode de fallback pour ajouter une entrée d'historique
  addMockHistoryEntry(entry: EmployeeHistory): Observable<EmployeeHistory> {
    const newEntry = { ...entry, id: this.mockHistory.length + 1 };
    this.mockHistory.push(newEntry);
    return of(newEntry);
  }
}