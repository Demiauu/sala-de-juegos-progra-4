import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-mayor-menor',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './mayor-menor.html',
    styleUrls: ['./mayor-menor.css']
})
export class MayorMenorComponent implements OnInit {
    private auth = inject(AuthService);
    private firestore = inject(FirestoreService);

    private palos = ['Corazones', 'Diamantes', 'Tréboles', 'Picas'];
    public mazo: { numero: number, palo: string }[] = [];

    public cartaActual = signal<{ numero: number, palo: string } | null>(null);
    public aciertos = signal<number>(0);
    public intentos = signal<number>(0);
    public partidaTerminada = signal<boolean>(false);
    public mensajeFeedback = signal<string>('La siguiente carta es mayor, menor o igual?');

    ngOnInit(): void {
        this.reiniciarJuego();
    }

    public reiniciarJuego() {
        this.aciertos.set(0);
        this.intentos.set(0);
        this.partidaTerminada.set(false);
        this.mensajeFeedback.set('La siguiente carta es mayor, menor o igual?');
        this.GenerarYMezclarMazo();

        this.cartaActual.set(this.mazo.pop() || null);
    }

    private GenerarYMezclarMazo() {
        this.mazo = [];
        for (let i = 1; i <= 12; i++) {
            for (const palo of this.palos) {
                this.mazo.push({ numero: i, palo });
            }
        }
        this.mazo.sort(() => Math.random() - 0.5);
    }

    public jugar(eleccion: 'mayor' | 'menor') {
        if (this.partidaTerminada() || this.mazo.length === 0) return;

        const siguientecarta = this.mazo.pop()!;
        const numeroactual = this.cartaActual()?.numero || 0;
        const numerosiguiente = siguientecarta.numero;

        this.intentos.update(i => i + 1);
        
        let acerto = false;
        // ⚡ Ajustado para coincidir con los botones "Mayor o Igual" / "Menor o Igual" de tu HTML
        if (eleccion === 'mayor' && numerosiguiente >= numeroactual) acerto = true;
        if (eleccion === 'menor' && numerosiguiente <= numeroactual) acerto = true;

        if (acerto) {
            this.aciertos.update(a => a + 1);
            this.mensajeFeedback.set('¡Correcto! La siguiente carta es ' + numerosiguiente + ' de ' + siguientecarta.palo);
        } else {
            this.mensajeFeedback.set('Incorrecto. La siguiente carta era ' + numerosiguiente + ' de ' + siguientecarta.palo);
        }

        this.cartaActual.set(siguientecarta);

        if (this.intentos() === 10) {
            this.finalizarpartida();
        }
    }

    private finalizarpartida() {
        this.partidaTerminada.set(true);
        this.mensajeFeedback.set(`Partida terminada. Aciertos: ${this.aciertos()}/10`);

        const usuarioActual = this.auth.usuarioLogueado();

        // 🛡️ Extracción segura de datos para la API REST HTTP
        const emailSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.email : '';
        const nameSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.displayName : '';

        // ⚡ Formateamos el payload idéntico a lo que espera recibir la base de datos y la tabla
        const payloadPuntaje = {
            usuario: nameSeguro || emailSeguro?.split('@')[0] || 'Alumno UTN',
            email: emailSeguro || 'anonimo@UTN.com',
            puntaje: this.aciertos()
        };

        this.firestore.guardarPuntaje('mayor-menor', payloadPuntaje)
            .then(() => {
                console.log('¡Puntaje de Mayor o Menor guardado con éxito por HTTP!');
            })
            .catch((err: any) => {
                console.error('Error al guardar puntaje en Mayor o Menor:', err);
            });
    }
}