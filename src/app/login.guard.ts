import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  let service = inject(Auth);
  let router = inject(Router);
  return service.authStateReady().then(value => { 
    return service.currentUser !== null? true : router.navigate(['/login']);
 });
  
};
