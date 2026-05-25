import { Injectable, inject, signal } from "@angular/core";
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authState } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Usuario } from "../models/users";
import { email } from "@angular/forms/signals";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private router = inject(Router);

    private usuarioLogueadoSignal = signal<Usuario | null>(null);

    public usuarioLogueado = this.usuarioLogueadoSignal.asReadonly();

    constructor() {

        authState(this.auth).subscribe((user) => {
            if (user && user.email) {
                this.usuarioLogueadoSignal.set({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                });
            } else {
                this.usuarioLogueadoSignal.set(null);
            }
        });
    }


    async registrar (email: string, password: string) {
        try {
            return await createUserWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            throw error;
        }
    }

    async login (email: string, password: string) {
        try {
            return await signInWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            throw error;
        }
    }

    async logout () {
        try {
            await signOut(this.auth);
            this.router.navigate(['/login']);
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    }
}