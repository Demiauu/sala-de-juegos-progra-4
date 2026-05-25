import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FirestoreService } from '../../../services/firestore.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const PREGUNTAS_MOCK = [
    {
        question: '¿Cuál es el río más largo del mundo?',
        correct_answer: 'Amazonas',
        incorrect_answers: ['Nilo', 'Misisippi', 'Yangtsé']
    },
    {
        question: '¿Qué significan las siglas HTML?',
        correct_answer: 'HyperText Markup Language',
        incorrect_answers: ['HighText Machine Language', 'HyperTech Main Log', 'HyperTabular Markup Level']
    },
    {
        question: '¿Quién es el protagonista del juego Hollow Knight?',
        correct_answer: 'El Caballero (The Knight)',
        incorrect_answers: ['Zote', 'Hornet', 'El Rey Pálido']
    },
    {
        question: '¿Cuál de los siguientes no es un framework de Frontend?',
        correct_answer: 'Express.js',
        incorrect_answers: ['Angular', 'React', 'Vue.js']
    },
    {
        question: '¿En qué provincia argentina se encuentra San Carlos de Bariloche?',
        correct_answer: 'Río Negro',
        incorrect_answers: ['Neuquén', 'Chubut', 'Mendoza']
    }
];

@Component({
    selector: 'app-preguntados',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './preguntados.html',
    styleUrl: './preguntados.css'
})
export class PreguntadosComponent implements OnInit {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private firestore = inject(FirestoreService);

    public preguntaActual = signal<any>(null);
    public opciones = signal<string[]>([]);

    public ronda = signal<number>(0);
    public correctas = signal<number>(0);
    public partidaTerminada = signal<boolean>(false);
    public mensajeResultado = signal<string>('');

    ngOnInit(): void {
        this.reiniciarjuego();
    }

    public reiniciarjuego() {
        this.ronda.set(0);
        this.correctas.set(0);
        this.partidaTerminada.set(false);
        this.mensajeResultado.set('');
        this.cargarPregunta();
    }

    private cargarPregunta() {
        this.mensajeResultado.set('');

        this.http.get('https://opentdb.com/api.php?amount=1&type=multiple').pipe(
            catchError((err: any) => {
                console.warn('⚠️ API OpenTDB bloqueada (429). Usando pregunta de contingencia local.');
                const randomMock = PREGUNTAS_MOCK[Math.floor(Math.random() * PREGUNTAS_MOCK.length)];
                const respuestaSimulada = {
                    results: [ randomMock ]
                };
                return of(respuestaSimulada);
            })
        ).subscribe({
            next: (res: any) => {
                if (res && res.results && res.results.length > 0) {
                    const item = res.results[0];

                    const preguntaLimpia = this.decodificarHTML(item.question);
                    const respuestaCorrectaLimpia = this.decodificarHTML(item.correct_answer);
                    const incorrectasLimpias = item.incorrect_answers.map((ans: string) => this.decodificarHTML(ans));

                    this.preguntaActual.set({
                        question: preguntaLimpia,
                        correct_answer: respuestaCorrectaLimpia
                    });
                    
                    const todasOpciones = [...incorrectasLimpias, respuestaCorrectaLimpia];
                    todasOpciones.sort(() => Math.random() - 0.5);

                    this.opciones.set(todasOpciones);
                    this.ronda.update(r => r + 1);
                }
            },
            error: (error: any) => {
                console.error('Error imprevisto en la suscripción:', error);
                this.mensajeResultado.set('Error al inicializar la ronda.');
            }
        });
    }

    public responder(opcion: string) {
        if (this.mensajeResultado()) return;

        const correcta = this.preguntaActual()?.correct_answer || '';
        if (opcion === correcta) {
            this.correctas.update(c => c + 1);
            this.mensajeResultado.set('¡Correcto!');
        } else {
            this.mensajeResultado.set(`Incorrecto. La respuesta correcta era: ${correcta}`);
        }

        setTimeout(() => {
            if (this.ronda() < 5) {
                this.cargarPregunta();
            } else {
                this.finalizarjuego();
            }
        }, 2500);
    }

    private finalizarjuego() {
        this.partidaTerminada.set(true);
        this.mensajeResultado.set(`Juego terminado. Respondiste ${this.correctas()}/5 preguntas correctamente.`);
        
        const usuarioActual = this.auth.usuarioLogueado();
        const emailSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.email : '';
        const nameSeguro = usuarioActual && typeof usuarioActual === 'object' ? usuarioActual.displayName : '';

        this.firestore.guardarPuntaje('preguntados', {
            usuario: nameSeguro || emailSeguro?.split('@')[0] || 'Alumno UTN',
            email: emailSeguro || 'anonimo@UTN.com',
            puntaje: this.correctas()
        }).then(() => {
            console.log('¡Puntaje de Preguntados guardado exitosamente!');
        }).catch((err: any) => {
            console.error('Error al subir ranking de Preguntados:', err);
        });
    }

    private decodificarHTML(texto: string): string {
        const txt = document.createElement('textarea');
        txt.innerHTML = texto;
        return txt.value;
    }
}