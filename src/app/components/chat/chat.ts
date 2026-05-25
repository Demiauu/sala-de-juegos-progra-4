import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.html',
    styleUrl: './chat.css'
})
export class ChatComponent implements OnInit {
    public auth = inject(AuthService);
    public firestore = inject(FirestoreService);

    public mensaje = signal<any[]>([]);
    public nuevoMensaje = '';

    ngOnInit(): void {
        this.cargarMensajes();
    }
    // Función para cargar los mensajes desde Firestore usando el servicio, y luego asignarlos a la señal "mensaje" para que se muestren en el HTML.
    public cargarMensajes() {
        this.firestore.obtenerMensajes().subscribe({
            next: (datos: any[]) => {
                this.mensaje.set(datos);
                setTimeout(() => this.scrollToBottom(), 100);
            },
            error: (err: any) => console.error('Error al traer mensajes:', err)
        });
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
                this.cargarMensajes(); // Recargamos la lista manualmente al enviar exitosamente
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