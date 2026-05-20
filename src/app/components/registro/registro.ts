import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { updateProfile } from '@angular/fire/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})

export class Registro {
  private authService = inject(AuthService);
  private router = inject(Router);

  public nombre: string = '';
  public apellido: string = '';
  public edad: string = '';
  public email: string = '';
  public clave: string = '';

  public mensajeError = signal<string | null>(null);
  public mensajeExito = signal<string | null>(null);

  async registrarse() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    if (!this.email || !this.clave) {
      this.mensajeError.set('Por favor, completa todos los campos.');
      return;
    }

    const edadNum = parseInt(this.edad);
    if (isNaN(edadNum) || edadNum <= 0) {
      this.mensajeError.set('Por favor, ingresa una edad mayor a 0.');
      return;
    }

    if (this.clave.length < 6) {
      this.mensajeError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const credenial = await this.authService.registrar(this.email, this.clave);

      if (credenial.user) {
        const nombreCompleto = `${this.nombre} ${this.apellido}`;
        await updateProfile(credenial.user, { displayName: nombreCompleto });
      }

      this.mensajeExito.set('¡Cuenta creada con éxito!');
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.mensajeError.set('Este correo ya está registrado por otro usuario.');
      } else if (error.code === 'auth/invalid-email') {
        this.mensajeError.set('El formato del correo no es válido.');
      } else {
        this.mensajeError.set('Ocurrió un error al intentar registrarse.');
      }
    }
  }
}