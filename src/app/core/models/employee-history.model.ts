export interface EmployeeHistory {
  id?: number;
  employeeId: number;
  employeeName?: string;
  action: string; // 'CREATE', 'UPDATE', 'DELETE'
  timestamp: string;
  details: string;
  modifiedBy?: string;
}