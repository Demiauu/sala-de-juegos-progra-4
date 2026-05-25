import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, authState, user } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  return authState(auth).pipe(
    take(1),
    map(user => {
      const isLogged = !!user;
      const targetPath = state.url;

      if (isLogged && (targetPath === '/login' || targetPath === '/registro')) {
        router.navigate(['/']);
        return false;
      }
    

    if (!isLogged && targetPath !== '/login' && targetPath !== '/registro') {
      router.navigate(['/login']);
      return false;
    }

    return true;
    })
  );
};
