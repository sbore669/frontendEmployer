export interface Employee {
  id?: number;
  nom: string;
  prenom: string;
  poste: string;
  email: string;
  dateEmbauche: string;
}

export interface EmployeeRequest {
  nom: string;
  prenom: string;
  poste: string;
  email: string;
  dateEmbauche: string;
}