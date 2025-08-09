import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Employee, EmployeeRequest } from '../models/employee.model';
import { EmployeeHistoryService } from './employee-history.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private historyService: EmployeeHistoryService,
    private environmentService: EnvironmentService
  ) {
    this.apiUrl = this.environmentService.getApiUrl('employees');
  }

  // Récupérer tous les employés
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  // Récupérer un employé par ID
  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouvel employé
  createEmployee(employee: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl+"/add", employee).pipe(
      tap(createdEmployee => {
        // Ajouter une entrée dans l'historique
        this.historyService.addHistoryEntry({
          employeeId: createdEmployee.id!,
          employeeName: `${createdEmployee.nom} ${createdEmployee.prenom}`,
          action: 'CREATE',
          timestamp: new Date().toISOString(),
          details: 'Création du profil employé',
          modifiedBy: 'Admin' // Idéalement, récupérer l'utilisateur connecté
        }).subscribe({
          error: (error) => {
            console.error('Erreur lors de l\'ajout dans l\'historique:', error);
            // Fallback aux données fictives en cas d'erreur
            this.historyService.addMockHistoryEntry({
              employeeId: createdEmployee.id!,
              employeeName: `${createdEmployee.nom} ${createdEmployee.prenom}`,
              action: 'CREATE',
              timestamp: new Date().toISOString(),
              details: 'Création du profil employé',
              modifiedBy: 'Admin'
            }).subscribe();
          }
        });
      })
    );
  }

  // Mettre à jour un employé
  updateEmployee(id: number, employee: EmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap(updatedEmployee => {
        // Ajouter une entrée dans l'historique
        this.historyService.addHistoryEntry({
          employeeId: updatedEmployee.id!,
          employeeName: `${updatedEmployee.nom} ${updatedEmployee.prenom}`,
          action: 'UPDATE',
          timestamp: new Date().toISOString(),
          details: 'Mise à jour du profil employé',
          modifiedBy: 'Admin' // Idéalement, récupérer l'utilisateur connecté
        }).subscribe({
          error: (error) => {
            console.error('Erreur lors de l\'ajout dans l\'historique:', error);
            // Fallback aux données fictives en cas d'erreur
            this.historyService.addMockHistoryEntry({
              employeeId: updatedEmployee.id!,
              employeeName: `${updatedEmployee.nom} ${updatedEmployee.prenom}`,
              action: 'UPDATE',
              timestamp: new Date().toISOString(),
              details: 'Mise à jour du profil employé',
              modifiedBy: 'Admin'
            }).subscribe();
          }
        });
      })
    );
  }

  // Supprimer un employé
  deleteEmployee(id: number): Observable<any> {
    // D'abord récupérer les informations de l'employé pour l'historique
    return new Observable(observer => {
      this.getEmployee(id).subscribe({
        next: (employee) => {
          // Ajouter une entrée dans l'historique avant la suppression
          this.historyService.addHistoryEntry({
            employeeId: employee.id!,
            employeeName: `${employee.nom} ${employee.prenom}`,
            action: 'DELETE',
            timestamp: new Date().toISOString(),
            details: 'Suppression du profil employé',
            modifiedBy: 'Admin' // Idéalement, récupérer l'utilisateur connecté
          }).subscribe({
            next: () => {
              // Effectuer la suppression réelle
              this.http.delete(`${this.apiUrl}/${id}`, { 
                responseType: 'text' as 'json' 
              }).subscribe({
                next: (response) => {
                  observer.next(response);
                  observer.complete();
                },
                error: (error) => observer.error(error)
              });
            },
            error: (error) => {
              console.error('Erreur lors de l\'ajout dans l\'historique:', error);
              // Fallback aux données fictives en cas d'erreur
              this.historyService.addMockHistoryEntry({
                employeeId: employee.id!,
                employeeName: `${employee.nom} ${employee.prenom}`,
                action: 'DELETE',
                timestamp: new Date().toISOString(),
                details: 'Suppression du profil employé',
                modifiedBy: 'Admin'
              }).subscribe({
                next: () => {
                  // Effectuer la suppression réelle
                  this.http.delete(`${this.apiUrl}/${id}`, { 
                    responseType: 'text' as 'json' 
                  }).subscribe({
                    next: (response) => {
                      observer.next(response);
                      observer.complete();
                    },
                    error: (error) => observer.error(error)
                  });
                },
                error: (error) => observer.error(error)
              });
            }
          });
        },
        error: (error) => observer.error(error)
      });
    });
  }
}