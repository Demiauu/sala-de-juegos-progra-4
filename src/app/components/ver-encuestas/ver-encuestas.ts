import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ver-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-encuestas.html',
  styleUrls: ['./ver-encuestas.css']
})
export class VerEncuestasComponent implements OnInit {
  private http = inject(HttpClient);
  
  public listaEncuestas = signal<any[]>([]);

  ngOnInit(): void {
    this.cargarEncuestas();
  }

  async cargarEncuestas() {
    try {
      const projectId = 'sala-de-juegos-p4';
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/encuestas?pageSize=100`;
      
      this.http.get<any>(url).subscribe({
        next: (response) => {
          if (!response || !response.documents) {
            this.listaEncuestas.set([]);
            return;
          }

          const mapeado = response.documents.map((doc: any) => {
            const fields = doc.fields;
            const edadRaw = fields?.edad?.integerValue || fields?.edad?.stringValue || '-';

            let recomiendaRaw = '-';
            if (fields?.recomiendaSala?.hasOwnProperty('booleanValue')) {
              recomiendaRaw = fields.recomiendaSala.booleanValue ? 'Sí' : 'No';
            } else if (fields?.recomiendaSala?.stringValue) {
              recomiendaRaw = fields.recomiendaSala.stringValue === 'true' ? 'Sí' : 'No';
            }

            return {
              usuario: fields?.usuario?.stringValue || 'Anónimo',
              nombre: fields?.nombreApellido?.stringValue || '-',
              edad: edadRaw,
              telefono: fields?.telefono?.stringValue || '-',
              opinion: fields?.opinionJuegos?.stringValue || '-',
              favorito: fields?.juegoFavorito?.stringValue || '-',
              recomienda: recomiendaRaw
            };
          });

          // Impactamos la señal una sola vez con los datos limpios
          this.listaEncuestas.set(mapeado);
        },
        error: () => this.listaEncuestas.set([])
      });
    } catch (error) {
      this.listaEncuestas.set([]);
    }
  }
}