import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'sala-de-juegos';

  public authService = inject(AuthService);

  public temaActual = signal<'dark' | 'light'>('dark');

  ngonInit() {
    const temaGuardado = localStorage.getItem('tema') as 'dark' | 'light';

    if (temaGuardado) {
      this.temaActual.set(temaGuardado);
    } else {
      const prefiereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.temaActual.set(prefiereClaro ? 'light' : 'dark');
    }

    this.aplicarTema();
  }

  toggleTema() {
    const nuevoTema = this.temaActual() === 'dark' ? 'light' : 'dark';
    this.temaActual.set(nuevoTema);
    localStorage.setItem('tema', nuevoTema);
    this.aplicarTema();
  }

  private aplicarTema() {
    if (this.temaActual() === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }
}
