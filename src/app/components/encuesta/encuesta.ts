import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './encuesta.html', // Vinculado a tu estructura
  styleUrls: ['./encuesta.css']
})
export class EncuestaComponent {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private router = inject(Router);

  // Modelo del formulario con datos personales y las 3 preguntas distintas requeridas
  public encuesta = {
    nombreApellido: '',
    edad: '',
    telefono: '',
    opinionJuegos: '',      // Pregunta 1: Textbox (Opinión libre)
    juegoFavorito: '',       // Pregunta 2: RadioButton (Opción única)
    recomiendaSala: false   // Pregunta 3: Checkbox (Sí/No)
  };

  public mensajeError = signal<string | null>(null);
  public mensajeExito = signal<string | null>(null);

  async enviarEncuesta() {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    // 1. Validar que todos los campos obligatorios estén completos
    if (!this.encuesta.nombreApellido.trim() || !this.encuesta.edad || 
        !this.encuesta.telefono.trim() || !this.encuesta.opinionJuegos.trim() || 
        !this.encuesta.juegoFavorito) {
      this.mensajeError.set('Por favor, completa todos los campos requeridos.');
      return;
    }

    // 2. Validación de Edad: mayor de 18 y menor de 99 años
    const edadNum = parseInt(this.encuesta.edad);
    if (isNaN(edadNum) || edadNum <= 18 || edadNum >= 99) {
      this.mensajeError.set('La edad debe ser mayor a 18 y menor a 99 años.');
      return;
    }

    // 3. Validación de Teléfono: solo números y máximo 10 caracteres
    const regexTelefono = /^[0-9]+$/;
    if (!regexTelefono.test(this.encuesta.telefono) || this.encuesta.telefono.length > 10) {
      this.mensajeError.set('El teléfono debe contener solo números y un máximo de 10 dígitos.');
      return;
    }

    try {
      // Obtenemos el mail del usuario actual logueado para identificarlo en la DB
      const usuarioActual = this.authService.usuarioLogueado()?.email || 'anonimo@UTN.com';
      const projectId = 'sala-de-juegos-p4'; 
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/encuestas`;

      // Mapeo JSON estricto con .fields exigido por la API REST de Firestore
      const body = {
        fields: {
          usuario: { stringValue: usuarioActual },
          nombreApellido: { stringValue: this.encuesta.nombreApellido },
          edad: { integerValue: edadNum.toString() },
          telefono: { stringValue: this.encuesta.telefono },
          opinionJuegos: { stringValue: this.encuesta.opinionJuegos },
          juegoFavorito: { stringValue: this.encuesta.juegoFavorito },
          recomiendaSala: { booleanValue: this.encuesta.recomiendaSala }
        }
      };

      await this.http.post(url, body).toPromise();

      this.mensajeExito.set('¡Encuesta enviada con éxito! Gracias por tu feedback.');
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2500);

    } catch (error) {
      this.mensajeError.set('Ocurrió un error al intentar guardar la encuesta.');
    }
  }
}