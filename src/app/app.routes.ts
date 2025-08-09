import { Routes } from '@angular/router';
import { LoginComponent, RedirectComponent, AuthGuard } from './auth';
import { DashboardComponent, EmployeeComponent } from './core';
import { HomeComponent } from './core/components/home/home.component';

export const routes: Routes = [
  { path: '', component: RedirectComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    children: [
      // { path: '', component: HomeComponent },
      { path: '', component: EmployeeComponent },
      { path: 'home', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '/' }
];
