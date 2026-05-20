import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
    private authService = inject(AuthService);
    private router = inject(Router);

    public email: string = '';
    public password: string = '';

    public mensajeError = signal<string | null>(null);

    async login() {
      this.mensajeError.set(null);
      if (!this.email || !this.password) {
        this.mensajeError.set('Por favor, ingresa email y contraseña');
        return;
      }

      try {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/']);
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' ) {
          this.mensajeError.set('Nombre de usuario o contraseña incorrectos');
        } else {
          this.mensajeError.set('Error al iniciar sesión. Intenta nuevamente.');
        }
      }
  }

  completarCamposPrueba(perfil: string) {
    this.mensajeError.set(null);
    if (perfil === 'admin') {
      this.email = 'admin@test.com';
      this.password = 'admin123';
    } else if (perfil === 'invitado') {
      this.email = 'invitado@test.com';
      this.password = '123456';
    } else if (perfil === 'jugador') {
      this.email = 'jugador@test.com';
      this.password = '123456';
    }
  
    this.login();
  }
}

