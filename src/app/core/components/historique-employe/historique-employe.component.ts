import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHistory } from '../../models/employee-history.model';
import { EmployeeHistoryService } from '../../services/employee-history.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique-employe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-employe.component.html',
  styleUrls: ['./historique-employe.component.css']
})
export class HistoriqueEmployeComponent implements OnInit {
  historyEntries: EmployeeHistory[] = [];
  filteredEntries: EmployeeHistory[] = [];
  selectedEmployeeId: number | null = null;
  searchTerm: string = '';
  actionFilter: string = 'ALL';
  
  // Liste des actions possibles pour le filtre
  actionTypes = [
    { value: 'ALL', label: 'Toutes les actions' },
    { value: 'CREATE', label: 'Création' },
    { value: 'UPDATE', label: 'Mise à jour' },
    { value: 'DELETE', label: 'Suppression' }
  ];

  constructor(private employeeHistoryService: EmployeeHistoryService) {}

  ngOnInit(): void {
    this.loadHistoryEntries();
  }

  loadHistoryEntries(): void {
    this.employeeHistoryService.getEmployeeHistory().subscribe({
      next: (entries) => {
        this.historyEntries = entries;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'historique:', error);
        // En cas d'erreur, utiliser les données fictives via la méthode de fallback
        this.employeeHistoryService.getMockEmployeeHistory().subscribe(mockEntries => {
          this.historyEntries = mockEntries;
          this.applyFilters();
        });
      }
    });
  }

  applyFilters(): void {
    let filtered = this.historyEntries;
    
    // Filtre par employé si un ID est sélectionné
    if (this.selectedEmployeeId) {
      filtered = filtered.filter(entry => entry.employeeId === this.selectedEmployeeId);
    }
    
    // Filtre par terme de recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(entry => 
        entry.employeeName?.toLowerCase().includes(term) ||
        entry.details.toLowerCase().includes(term) ||
        entry.modifiedBy?.toLowerCase().includes(term)
      );
    }
    
    // Filtre par type d'action
    if (this.actionFilter !== 'ALL') {
      filtered = filtered.filter(entry => entry.action === this.actionFilter);
    }
    
    // Tri par date (du plus récent au plus ancien)
    this.filteredEntries = filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  resetFilters(): void {
    this.selectedEmployeeId = null;
    this.searchTerm = '';
    this.actionFilter = 'ALL';
    this.applyFilters();
  }

  // Formater la date pour l'affichage
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Obtenir la classe CSS en fonction du type d'action
  getActionClass(action: string): string {
    switch (action) {
      case 'CREATE': return 'action-create';
      case 'UPDATE': return 'action-update';
      case 'DELETE': return 'action-delete';
      default: return '';
    }
  }
}