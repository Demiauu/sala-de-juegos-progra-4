import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  public auth = inject(AuthService);
  private router = inject(Router);

  public estaLogueado = signal<boolean>(false);

  ngOnInit(): void {
    const user = typeof this.auth.usuarioLogueado() === 'function'
      ? this.auth.usuarioLogueado()
      : this.auth.usuarioLogueado;

      this.estaLogueado.set(!!user);
  }
  public entrarAJuego(rutaJuego: string) {
    if (this.auth.usuarioLogueado()) {
      this.router.navigate([`/${rutaJuego}`]);
    }
  }
}