import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore: Firestore = inject(Firestore);
    private http = inject(HttpClient);

    // ID de la base de datos de Firestore.
    private projectId = 'sala-de-juegos-p4'; 

    // --- SECCIÓN CHAT ---

    // Envía el mensaje estructurando el JSON de la API REST de Firestore.
    enviarMensaje(chatMessage: {usuario: string, email: string, mensaje: string, fecha: number}) {
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/chat-global`;
        const body = {
            fields: {
                usuario: { stringValue: chatMessage.usuario },
                email: { stringValue: chatMessage.email },
                mensaje: { stringValue: chatMessage.mensaje },
                fecha: { integerValue: chatMessage.fecha.toString() } // Convierte el numero a string para el formato de firestore
            }
        };
        return this.http.post(url, body).toPromise();
    }

    // Consume la API REST de firestore para obtener los mensajes de la coleccion "chat-global".
    obtenerMensajes(): Observable<any[]> {
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/chat-global?pageSize=50`;
        return this.http.get<any>(url).pipe(
            map(response => {
                if (!response || !response.documents) return []; // Verifica si la respuesta es valida y contiene documentos
                return response.documents.map((doc: any) => {
                    const fields = doc.fields; // Contenedor de los campos del mensaje
                    return {
                        // Si el campo "usuario" no existe, se asigna un valor por defecto. Lo mismo para los otros campos.
                        usuario: fields?.usuario?.stringValue || 'Alumno UTN',
                        email: fields?.email?.stringValue || 'anonimo@UTN.com',
                        mensaje: fields?.mensaje?.stringValue || '',
                        fecha: Number(fields?.fecha?.integerValue || Date.now()) // Convierte el string a numero para el formato de fecha
                    };
                }).sort((a: any, b: any) => a.fecha - b.fecha); // Ordena los mensajes de menor a mayor por fecha
            })
        );
    }

    // --- SECCIÓN PUNTAJES (RELAZADOS POR HTTP) ---
    // Guarda el puntaje de cada juego en una colección específica, ej: puntaje-ahorcado, puntaje-mayor-menor, etc.
    guardarPuntaje(juego: string, puntaje: any) {
        // Se guarda en la colección específica de cada juego, ej: puntaje-ahorcado
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/puntaje-${juego}`;
        
        const body = {
            // Estructura del JSON para guardar el puntaje en Firestore, con campos dinámicos según el juego.
            fields: {
                usuario: { stringValue: puntaje.usuario || 'Alumno UTN' },
                email: { stringValue: puntaje.email || 'anonimo@UTN.com' },
                puntaje: { integerValue: puntaje.puntaje.toString() },
                fecha: { integerValue: Date.now().toString() }
            }
        };
        return this.http.post(url, body).toPromise();
    }

    // Obtiene los puntajes de cada juego desde la colección específica, ej: puntaje-ahorcado, y los ordena de mayor a menor.
    obtenerPuntajes(juego: string): Observable<any[]> {
        // Apuntamos dinámicamente a la colección del juego, ej: puntaje-mayor-menor
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/puntaje-${juego}?pageSize=20`;
        
        return this.http.get<any>(url).pipe(
            map(response => {
                // Si la colección está vacía o no existe todavía, devolvemos un array limpio
                if (!response || !response.documents) return [];
                
                // Mapeamos los campos JSON de Google Firestore a un formato más amigable para la tabla de puntajes
                return response.documents.map((doc: any) => {
                    const fields = doc.fields;
                    
                    const nombreUsuario = fields?.usuario?.stringValue || fields?.jugador?.stringValue || 'Alumno UTN';
                    
                    const score = fields?.puntaje?.integerValue || fields?.aciertos?.integerValue || 0;

                    return {
                        usuario: nombreUsuario,
                        email: fields?.email?.stringValue || 'anonimo@UTN.com',
                        puntaje: Number(score),
                        fecha: Number(fields?.fecha?.integerValue || Date.now())
                    };

                // Los ordena de Mayor a Menor en la tabla de puntajes
                }).sort((a: any, b: any) => b.puntaje - a.puntaje);
            })
        );
    }
}