import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
    selector: 'app-click-juego',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './click-juego.html',
    styleUrl: './click-juego.css'
})
export class ClickJuegoComponent implements OnInit, OnDestroy {
    private auth = inject(AuthService);
    private firestore = inject(FirestoreService);

    public puntos = signal<number>(0);
    public tiempoRestante = signal<number>(15); // 15 segundos límite
    public jugando = signal<boolean>(false);
    public partidaTerminada = signal<boolean>(false);

    // Posición del botón objetivo en porcentaje (%) de la pantalla
    public botonTop = signal<string>('50%');
    public botonLeft = signal<string>('50%');

    private intervaloTiempo: any;
    private intervaloMovimiento: any;
    private velocidadMovimiento: number = 1000; // Arranca moviéndose cada 1 segundo (1000ms)

    ngOnInit(): void {
        this.resetearJuego();
    }

    ngOnDestroy(): void {
        this.limpiarIntervalos();
    }

    public resetearJuego() {
        this.puntos.set(0);
        this.tiempoRestante.set(15);
        this.jugando.set(false);
        this.partidaTerminada.set(false);
        this.velocidadMovimiento = 1000;
        this.botonTop.set('50%');
        this.botonLeft.set('50%');
    }

    public iniciarJuego() {
        this.jugando.set(true);
        this.moverBoton();

        // Cronómetro del juego (baja cada 1 segundo)
        this.intervaloTiempo = setInterval(() => {
            this.tiempoRestante.update(t => t - 1);
            if (this.tiempoRestante() <= 0) {
                this.finalizarJuego();
            }
        }, 1000);

        // Bucle que mueve el botón automáticamente según la velocidad actual
        this.ajustarRitmoMovimiento();
    }

    public clickObjetivo() {
        if (!this.jugando() || this.partidaTerminada()) return;

        // Suma puntos
        this.puntos.update(p => p + 10);

        // Aceleramos el movimiento un 8% cada vez que acierta, pero nunca menos de 350ms para que siga siendo jugable
        this.velocidadMovimiento = Math.max(350, this.velocidadMovimiento * 0.92); 

        // Forzamos un movimiento inmediato al clickear
        this.moverBoton();
        this.ajustarRitmoMovimiento();
    }

    private moverBoton() {
        // Dejamos un margen del 10% al 85% para que el botón no se salga de los bordes de la card
        const randomTop = Math.floor(Math.random() * 75) + 10;
        const randomLeft = Math.floor(Math.random() * 75) + 10;

        // Actualizamos la posición del botón en el estado
        this.botonTop.set(`${randomTop}%`);
        this.botonLeft.set(`${randomLeft}%`);
    }

    private ajustarRitmoMovimiento() {
        if (this.intervaloMovimiento) clearInterval(this.intervaloMovimiento);
        
        this.intervaloMovimiento = setInterval(() => {
            this.moverBoton();
        }, this.velocidadMovimiento);
    }

    private finalizarJuego() {
        this.limpiarIntervalos();
        this.jugando.set(false);
        this.partidaTerminada.set(true);

        const usuarioActual = this.auth.usuarioLogueado();
        const emailSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.email : '';
        const nameSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.displayName : '';

        // Payload unificado que viaja directo por HTTP a tu Firestore
        const payloadPuntaje = {
            usuario: nameSeguro || emailSeguro?.split('@')[0] || 'Alumno UTN',
            email: emailSeguro || 'anonimo@UTN.com',
            puntaje: this.puntos()
        };

        this.firestore.guardarPuntaje('click-extremo', payloadPuntaje)
            .then(() => console.log('¡Puntaje de Click Extremo registrado!'))
            .catch((err: any) => console.error('Error al guardar puntaje:', err));
    }

    private limpiarIntervalos() {
        if (this.intervaloTiempo) clearInterval(this.intervaloTiempo);
        if (this.intervaloMovimiento) clearInterval(this.intervaloMovimiento);
    }
}