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

    // ⚡ ID de tu proyecto Firebase exacto
    private projectId = 'sala-de-juegos-p4'; 

    // --- SECCIÓN CHAT ---
    enviarMensaje(chatMessage: {usuario: string, email: string, mensaje: string, fecha: number}) {
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/chat-global`;
        const body = {
            fields: {
                usuario: { stringValue: chatMessage.usuario },
                email: { stringValue: chatMessage.email },
                mensaje: { stringValue: chatMessage.mensaje },
                fecha: { integerValue: chatMessage.fecha.toString() }
            }
        };
        return this.http.post(url, body).toPromise();
    }

    obtenerMensajes(): Observable<any[]> {
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/chat-global?pageSize=50`;
        return this.http.get<any>(url).pipe(
            map(response => {
                if (!response || !response.documents) return [];
                return response.documents.map((doc: any) => {
                    const fields = doc.fields;
                    return {
                        usuario: fields?.usuario?.stringValue || 'Alumno UTN',
                        email: fields?.email?.stringValue || 'anonimo@UTN.com',
                        mensaje: fields?.mensaje?.stringValue || '',
                        fecha: Number(fields?.fecha?.integerValue || Date.now())
                    };
                }).sort((a: any, b: any) => a.fecha - b.fecha);
            })
        );
    }

    // --- SECCIÓN PUNTAJES (RELAZADOS POR HTTP) ---
    guardarPuntaje(juego: string, puntaje: any) {
        // Se guarda en la colección específica de cada juego, ej: puntaje-ahorcado
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/puntaje-${juego}`;
        
        const body = {
            fields: {
                usuario: { stringValue: puntaje.usuario || 'Alumno UTN' },
                email: { stringValue: puntaje.email || 'anonimo@UTN.com' },
                puntaje: { integerValue: puntaje.puntaje.toString() },
                fecha: { integerValue: Date.now().toString() }
            }
        };
        return this.http.post(url, body).toPromise();
    }

    obtenerPuntajes(juego: string): Observable<any[]> {
        // Apuntamos dinámicamente a la colección del juego, ej: puntaje-mayor-menor
        const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/puntaje-${juego}?pageSize=20`;
        
        return this.http.get<any>(url).pipe(
            map(response => {
                // Si la colección está vacía o no existe todavía, devolvemos un array limpio
                if (!response || !response.documents) return [];
                
                // Mapeamos los campos JSON de Google al formato que lee tu HTML
                return response.documents.map((doc: any) => {
                    const fields = doc.fields;
                    
                    // 🛡️ DOBLE SALVAVIDAS: Busca tanto 'usuario' (nuevo) como 'jugador' (viejo) 
                    // para que no quede ninguna celda en blanco en la tabla
                    const nombreUsuario = fields?.usuario?.stringValue || fields?.jugador?.stringValue || 'Alumno UTN';
                    
                    // Captura el puntaje o los aciertos según cómo se haya grabado
                    const score = fields?.puntaje?.integerValue || fields?.aciertos?.integerValue || 0;

                    return {
                        usuario: nombreUsuario,
                        email: fields?.email?.stringValue || 'anonimo@UTN.com',
                        puntaje: Number(score),
                        fecha: Number(fields?.fecha?.integerValue || Date.now())
                    };
                // Los ordena de Mayor a Menor (Top de posiciones)
                }).sort((a: any, b: any) => b.puntaje - a.puntaje);
            })
        );
    }
}