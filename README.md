# 🎮 Sala de Juegos — Trabajo Práctico #1

**Materia:** Programación IV 
**Institución:** Universidad Tecnológica Nacional (UTN) — Facultad Regional Avellaneda (FRA)
**Carrera:** Tecnicatura Universitaria en Programación (TUP)
**Alumno:** Demian Agustin Paz Gamboa  

🚀 **Link del Deploy Activo (Vercel):** sala-de-juegos-progra-4.vercel.app

---

## 📋 Descripción General
Aplicación frontend interactiva desarrollada en **Angular** y conectada a **Firebase** como servidor backendEl objetivo de la plataforma es permitir a los usuarios (jugadores) medir sus capacidades cognitivas y motrices a través de una sala integrada con juegos, chat en tiempo real y clasificaciones globales

---

## 🎨 Características de Diseño y UX
***UI Uniforme (Glassmorphism):** Diseño moderno traslúcido con total soporte y contraste adaptativo para Modo Oscuro (base bordeaux/negro) y Modo Claro (base rosado/blanco).
**Cero alerts nativos:** Toda la comunicación de victoria, derrota o alertas del sistema se realiza mediante modales estéticos de Bootstrap.
**Favicon Propio:** Icono de la aplicación personalizado e implementado globalmente.
**Animaciones:** Transiciones visuales suaves mediante CSS para mejorar el feedback del usuario.
**Persistencia:** Integración con LocalStorage para almacenar la preferencia estética del usuario, manteniendo el tema elegido al recargar la página.

---

## 🗂️ Sprints Desarrollados (Contenido Acumulativo)

### 🔹 Sprint #1 & #2 (Estructura Base y Autenticación)
**Login y Registro de Usuarios:** Sistema de autenticación con Firebase Auth usando correo y contraseña. El registro captura y persiste en la base de datos el `Nombre`, `Apellido`, `Edad` y `Email`.
**Botones de Acceso Rápido:** Tres botones de inicio de sesión rápido en la pantalla de Login para agilizar los testeos de la cátedra mediante perfiles precargados.
**Control de Sesión Reactivo:** Uso de *Angular Signals* para ocultar dinámicamente los botones de Login/Registro según el estado de autenticación, mostrando el nombre del jugador y el botón de cierre de sesión.
**Componente Quién Soy:** Integración con la **API de GitHub** (`https://api.github.com/users/Demiauu`) para renderizar dinámicamente la foto de perfil, nombre del desarrollador y la fecha de creación de la cuenta.

### 🔹 Sprint #3 (Juegos Base y Chat)
**Juego — Ahorcado:** Lógica interactiva con un teclado virtualizado en pantalla mediante botones (bloqueando por completo el teclado físico) Al finalizar, guarda en Firestore el usuario, tiempo, puntaje y letras seleccionadas.
**Juego — Mayor o Menor:** Dinámica con una simulación de baraja de naipes, donde el usuario debe arriesgar si la tendencia de la siguiente carta es mayor o menor Al terminar, guarda las estadísticas en la base de datos.
**Sala de Chat Global:** Canal de comunicación único en vivo para usuarios logueados. Funciona en tiempo real mediante suscripción a Firebase (realtime sin recargar la página), diferenciando estéticamente los mensajes propios de los enviados por terceros.

### 🔹 Sprint #4 (Juegos Avanzados y Clasificaciones)
**Juego — Preguntados:** Consumo dinámico de preguntas y opciones desde una API externa mediante `HttpClient`. Interacción controlada por botones en pantalla y guardado de aciertos en la base de datos.
**Juego Propio — Click Extremo (Speed Clicker):** Desarrollo original orientado a medir la capacidad motriz y los reflejos del jugador mediante un objetivo aleatorio en un lapso de 15 segundos. Evita las opciones penalizadas por la cátedra (Tatetí, Memotest, Piedra/Papel/Tijera) y cuenta con su descripción técnica en la sección "Quién Soy"
**Listados de Resultados Globales:** Vista centralizada (`Resultados`) con 4 tablas correspondientes a cada juego. Los datos se muestran ordenados jerárquicamente de mejor a peor desempeño consumidos directamente desde Firestore.

---

## 🛠️ Tecnologías Utilizadas
**Frontend:** Angular (Componentes Standalone, Signals, Control Flow nativo `@for`/`@if`) 
**Estilos y Animaciones:** Bootstrap 5, Animaciones CSS nativas, Google Fonts (Outfit) 
**Backend & Base de Datos:** Firebase Auth, Firebase Cloud Firestore (Suscripciones en tiempo real) 
**Hosting / Deploy:** Vercel
**Control de Versiones:** Git & GitHub (Estructura de ramas independientes y Pull Requests por sprint)
