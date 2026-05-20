# Sala de Juegos - TP1 Programación IV

**Alumno:** Demian Agustin Paz Gamboa
**Carrera:** Tecnicatura Universitaria en Programación (TUP) - UTN FRA  
**Link del Deploy:** https://sala-de-juegos-progra-4-git-rama-sprint-2-demiauus-projects.vercel.app

## Tecnologías Utilizadas
* Angular (Versión Moderna - Componentes Standalone)
* Control de Estado con Angular Signals
* Git / GitHub / Vercel

## Sprints Desarrollados

### 🔹 Sprint #2
* **Autenticación con Firebase:** Integración completa de Firebase Authentication para el manejo seguro de usuarios en tiempo real.
* **Registro de Usuarios:** Se expandió el formulario de registro para capturar `Nombre`, `Apellido`, `Edad`, `Email` y `Contraseña`.
* **Validaciones:** Implementación de controles estrictos en TypeScript y HTML (como el control estricto de edad $> 0$) para evitar registros vacíos o erróneos antes de impactar en Firebase.
* **Control de Sesión Reactivo:** Uso de *Angular Signals* para ocultar dinámicamente los botones de Login y Registro una vez iniciada la sesión, mostrando en su lugar el Nombre y Apellido del jugador logueado (`displayName`) y el botón de cierre de sesión.
* **Sistema de Temas Dinámico (Dark/Light Mode):** Implementación de un switch de cambio de luces que manipula variables CSS nativas a nivel global.
* **Persistencia con LocalStorage:** Integración con la API del navegador para almacenar la preferencia estética del usuario, logrando que el tema elegido se mantenga incluso al recargar o cerrar la aplicación.
