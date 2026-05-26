import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home').then(m => m.Home)
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
    path: 'ahorcado', 
    loadComponent: () => import('./components/juegos/ahorcado/ahorcado').then(m => m.AhorcadoComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'mayor-menor', 
    loadComponent: () => import('./components/juegos/mayor-menor/mayor-menor').then(m => m.MayorMenorComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'preguntados', 
    loadComponent: () => import('./components/juegos/preguntados/preguntados').then(m => m.PreguntadosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./components/chat/chat').then(m => m.ChatComponent),
    canActivate: [authGuard]
  },
  {
    path: 'resultados',
    loadComponent: () => import('./components/resultados/resultados').then(m => m.ResultadosComponent),
    canActivate: [authGuard]
  },
  {
    path: 'click-juego',
    loadComponent: () => import('./components/juegos/click-juego/click-juego').then(m => m.ClickJuegoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'encuesta',
    loadComponent: () => import('./components/encuesta/encuesta').then(m => m.EncuestaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ver-encuestas',
    loadComponent: () => import('./components/ver-encuestas/ver-encuestas').then(m => m.VerEncuestasComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'quien-soy', 
    loadComponent: () => import('./components/quien-soy/quien-soy').then(m => m.QuienSoyComponent) 
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];