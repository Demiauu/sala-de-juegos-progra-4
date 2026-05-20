import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home').then(m => m.Home), 
    canActivate: [authGuard] 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.Login),
    canActivate: [authGuard]
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./components/registro/registro').then(m => m.Registro),
    canActivate: [authGuard]
  },
  { 
    path: 'quien-soy', 
    loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoyComponent) 
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];