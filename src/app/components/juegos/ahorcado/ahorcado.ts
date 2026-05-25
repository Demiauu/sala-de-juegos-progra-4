import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-ahorcado',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ahorcado.html',
    styleUrl: './ahorcado.css'
})

export class AhorcadoComponent implements OnInit {
    private auth = inject(AuthService);
    private firestore = inject(FirestoreService);

    public Palabras = ['ANGULAR', 'JAVASCRIPT', 'TYPESCRIPT', 'PROGRAMACION', 'DESARROLLO'];
    public PalabraSecreta = signal<string[]>([]);
    public PalabraElegida = '';

    public abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    public letrasUsadas = signal<string[]>([]);

    public intentosRestantes = signal<number>(6);
    public partidaTerminada = signal<boolean>(false);
    public resultado = signal<string>('');

    private tiempoInicio!: number;

    ngOnInit(): void {
        this.reiniciarjuego();
    }

    public reiniciarjuego() {
        this.PalabraElegida = this.Palabras[Math.floor(Math.random() * this.Palabras.length)];
        this.PalabraSecreta.set(Array(this.PalabraElegida.length).fill('_'));
        this.letrasUsadas.set([]);
        this.intentosRestantes.set(6);
        this.partidaTerminada.set(false);
        this.resultado.set('');
        this.tiempoInicio = Date.now();
    }

    public seleccionarletra(letra: string) {
        if (this.partidaTerminada() || this.letrasUsadas().includes(letra)) return;
        this.letrasUsadas.update(list => [...list, letra]);

        if (this.PalabraElegida.includes(letra)) {
            const nuevaPalabra = [...this.PalabraSecreta()];
            for (let i = 0; i < this.PalabraElegida.length; i++) {
                if (this.PalabraElegida[i] === letra) nuevaPalabra[i] = letra;
            }
            this.PalabraSecreta.set(nuevaPalabra);

            if (!nuevaPalabra.includes('_')) {
                this.finalizarjuego(true);
            }
        } else {
            this.intentosRestantes.update(i => i - 1);
            if (this.intentosRestantes() <= 0) {
                this.finalizarjuego(false);
            }
        }
    }
    
    private finalizarjuego(ganado: boolean) {
        this.partidaTerminada.set(true);
        const tiempoFinal = Math.round((Date.now() - this.tiempoInicio) / 1000);

        this.resultado.set(ganado ? `¡Ganaste! Tiempo: ${tiempoFinal} segundos` : `Perdiste. La palabra era: ${this.PalabraElegida}`);

        const usuario = this.auth.usuarioLogueado();
        this.firestore.guardarPuntaje('ahorcado', {
            jugador: usuario?.displayName || usuario?.email || 'Invitado',
            letrasUsadas: this.letrasUsadas().length,
            intentosRestantes: this.intentosRestantes(),
            tiempo: tiempoFinal,
            resultado: ganado ? 'Ganado' : 'Perdido',
            puntaje: ganado ? (100 - tiempoFinal - (6 - this.intentosRestantes()) * 10) : 0
        });
    }
}
