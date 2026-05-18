import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoyComponent implements OnInit {
  datosGithub = signal<any>(null);
  usuarioGithub: string = 'Demiauu';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`https://api.github.com/users/${this.usuarioGithub}`)
      .subscribe({
        next: (respuesta) => {
          this.datosGithub.set(respuesta);
        },
        error: (error) => {
          console.error('Error al conectar con la API de GitHub', error)
        }
      });
  }
}
