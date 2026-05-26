import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth'; // Importamos las herramientas nativas de Firebase
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const firebaseAuth = inject(Auth); // Inyectamos el servicio nativo de Firebase
  const router = inject(Router);

  // Lista de Emails autorizados como Administradores
  const listaAdmins = [
    'gaston.plazas@utn.com', 
    'admin@sala.com',
    'demian@admin.com',
    'admin@test.com'
  ];

  // Escuchamos el estado real y vivo de Firebase Auth de forma asíncrona
  return authState(firebaseAuth).pipe(
    take(1), // Tomamos la primera emisión válida y cerramos el flujo de escucha
    map(user => {
      const emailUsuario = user?.email;

      // Si el usuario existe y su correo está en la lista blanca, habilitamos el acceso
      if (emailUsuario && listaAdmins.includes(emailUsuario.toLowerCase().trim())) {
        return true;
      }

      // Si no cumple, se lo rebota de forma limpia al Home
      console.warn(`Acceso bloqueado para: ${emailUsuario || 'Usuario no autenticado'}`);
      router.navigate(['/']);
      return false;
    })
  );
};