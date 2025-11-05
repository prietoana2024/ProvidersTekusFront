
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';

// ✅ Función interceptor para Angular 20
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener token
  const token = authService.getToken();

  // Clonar request y agregar token si existe
  const authReq = token 
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si es 401 Unauthorized, cerrar sesión
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
