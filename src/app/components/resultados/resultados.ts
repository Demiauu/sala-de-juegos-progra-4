import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';

@Component({
    selector: 'app-resultados',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './resultados.html',
    styleUrl: './resultados.css'
})
export class ResultadosComponent implements OnInit {
    private firestoreService = inject(FirestoreService);

    public resClickExtremo = signal<any[]>([]);
    public resAhorcado = signal<any[]>([]);
    public resMayorMenor = signal<any[]>([]);
    public resPreguntados = signal<any[]>([]);
    
    ngOnInit(): void {
        this.firestoreService.obtenerPuntajes('ahorcado').subscribe(d => {
            this.resAhorcado.set(d);
        });

        this.firestoreService.obtenerPuntajes('mayor-menor').subscribe(d => {
            this.resMayorMenor.set(d);
        });

        this.firestoreService.obtenerPuntajes('preguntados').subscribe(d => {
            this.resPreguntados.set(d);
        });

        this.firestoreService.obtenerPuntajes('click-extremo').subscribe(d => {
            this.resClickExtremo.set(d);
        });
    }
}