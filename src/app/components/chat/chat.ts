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

    public cargarMensajes() {
        this.firestore.obtenerMensajes().subscribe({
            next: (datos: any[]) => {
                this.mensaje.set(datos);
                setTimeout(() => this.scrollToBottom(), 100);
            },
            error: (err: any) => console.error('Error al traer mensajes:', err)
        });
    }

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

        this.firestore.enviarMensaje(payload)
            .then(() => {
                this.nuevoMensaje = '';
                this.cargarMensajes(); // Recargamos la lista manualmente al enviar exitosamente
            })
            .catch((error: any) => {
                console.error('Error al enviar mensaje:', error);
            });
    }

    private scrollToBottom() {
        const contenedor = document.getElementById('chat-contenedor');
        if (contenedor) {
            contenedor.scrollTop = contenedor.scrollHeight;
        }
    }
}