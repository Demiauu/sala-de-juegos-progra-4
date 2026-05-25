import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { GitHubUser } from '../../models/users';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})

export class QuienSoyComponent implements OnInit {
  private http = inject(HttpClient);

  public nombreDev = 'Demian Agustin Paz Gamboa';
  public tituloCarrera = 'Estudiante de Tecnicatura Universitaria en Programación (UTN)';

  public juegoPropio = {
    titulo: 'Click Extremo (Speed Clicker)',
    motivo: 'Cumple con creces la pauta de medir la capacidad motriz y velocidad de reacción del usuario. Es una alternativa ágil que no repite las opciones prohibidas (Tateti, Memotest, Piedra Papel o Tijera).',
    comoJuega: 'El jugador tendrá un tiempo límite de 15 segundos para clickear un botón objetivo que se moverá de forma aleatoria por la pantalla. Cada click exitoso sumará puntos y acelerará la velocidad de movimiento, testeando al máximo los reflejos del usuario.'
  };

  public avatarUrl = signal<string | null>(null);
  public cuentaCreadaDesde = signal<string>('Cargando...');

  ngOnInit(): void {
    this.http.get<any>('https://api.github.com/users/Demiauu')
      .subscribe({
        next: (data) => {
          if (data.avatar_url) {
            this.avatarUrl.set(data.avatar_url);
          }
          if (data.created_at) {
            this.cuentaCreadaDesde.set(this.formatearFecha(data.created_at));
          }
        },
        error: (error) => {
          console.error('Error al conectar con la API de GitHub', error);
          this.cuentaCreadaDesde.set('No Disponible');
        }
      });
  }

  private formatearFecha(fechaRaw: string): string {
    const fecha = new Date(fechaRaw);
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}