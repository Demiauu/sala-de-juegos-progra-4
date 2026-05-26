import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { interval, Subscription, switchMap, startWith } from 'rxjs';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrl: './chat.css'
})
export class ChatComponent implements OnInit, OnDestroy {
    public auth = inject(AuthService);
    public firestore = inject(FirestoreService);

    public mensaje = signal<any[]>([]);
    public nuevoMensaje = '';

    
// Guardamos la suscripción para poder matarla al salir de la pantalla
    private chatSub!: Subscription;

    ngOnInit(): void {
        this.chatSub = interval(2000)
            .pipe(
                startWith(0), // Ejecuta la primera carga al instante nada más entrar al chat
                switchMap(() => this.firestore.obtenerMensajes()) // Cancela peticiones colgadas si internet va lento
            )
            .subscribe({
                next: (datos: any[]) => {
                    // Solo actualizamos la señal y hacemos scroll si entraron mensajes nuevos
                    if (datos.length !== this.mensaje().length) {
                        this.mensaje.set(datos);
                        setTimeout(() => this.scrollToBottom(), 100);
                    }
                },
                error: (err: any) => console.error('Error en el stream del chat:', err)
            });
    }

    // 🛡️ LIBERACIÓN DE MEMORIA: Al salir de la pestaña a cualquier juego, frena el bucle de red
    ngOnDestroy(): void {
        if (this.chatSub) {
            this.chatSub.unsubscribe();
        }
    }

    // Envía el mensaje al hacer click en el botón o presionando Enter, y luego recarga la lista de mensajes para mostrar el nuevo mensaje enviado.
    public enviarMensaje() {
        if (!this.nuevoMensaje || !this.nuevoMensaje.trim()) return;

        const usuarioActual = this.auth.usuarioLogueado();
        const emailSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.email : '';
        const nameSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.displayName : '';

        const payload = {
            usuario: nameSeguro || emailSeguro?.split('@')[0] || 'Alumno UTN',
            email: emailSeguro || 'anonimo@UTN.com',
            mensaje: this.nuevoMensaje.trim(),
            fecha: Date.now()
        };
        // Enviamos el mensaje a Firestore usando el servicio, y luego recargamos la lista de mensajes para mostrar el nuevo mensaje enviado.
        this.firestore.enviarMensaje(payload)
            .then(() => {
                this.nuevoMensaje = '';
            })
            .catch((error: any) => {
                console.error('Error al enviar mensaje:', error);
            });
    }
    // Función para hacer scroll automático al final del contenedor de mensajes cada vez que se cargan nuevos mensajes.
    private scrollToBottom() {
        const contenedor = document.getElementById('chat-contenedor');
        if (contenedor) {
            contenedor.scrollTop = contenedor.scrollHeight;
        }
    }
}