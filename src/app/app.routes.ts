import { Routes } from '@angular/router';
import { LoginComponent, RedirectComponent, AuthGuard, InscriptionComponent } from './auth';
import { DashboardComponent, EmployeeComponent } from './core';
import { HomeComponent } from './core/components/home/home.component';
import { HistoriqueEmployeComponent } from './core/components/historique-employe/historique-employe.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inscription', component: InscriptionComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      // { path: '', component: HomeComponent },
      { path: '', component: EmployeeComponent },
      { path: 'home', redirectTo: '' },
      { path: 'historique', component: HistoriqueEmployeComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
