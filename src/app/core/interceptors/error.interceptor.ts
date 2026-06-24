import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado.';
      if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
        errorMessage = `Error de red: ${error.error.message}`;
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
      console.error('Error Interceptado:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
