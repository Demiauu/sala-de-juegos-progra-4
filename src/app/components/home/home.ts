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
    // Verificamos el estado de autenticación del usuario al cargar el componente, y actualizamos la señal "estaLogueado" para mostrar u ocultar los botones de acceso a los juegos.
    const user = typeof this.auth.usuarioLogueado() === 'function'
      ? this.auth.usuarioLogueado()
      : this.auth.usuarioLogueado;

      this.estaLogueado.set(!!user);
  }

  public esAdmin(): boolean {
    const usuario = this.auth.usuarioLogueado();
    const email = usuario && typeof usuario === 'object' ? usuario.email : null;

    const listaAdmins = [
      'admin@test.com'];

      return email ? listaAdmins.includes(email.toLowerCase().trim()) : false;
    }

  // Función para navegar a la ruta del juego seleccionado, solo si el usuario está logueado. Si no está logueado, no hace nada.
  public entrarAJuego(rutaJuego: string) {
    if (this.auth.usuarioLogueado()) {
      this.router.navigate([`/${rutaJuego}`]);
    }
  }
}