import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const token = authService.currentUser()?.token ?? getTokenFromStorage();
  const request =
    token && !req.headers.has('Authorization')
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
      : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isLoginRequest(req.url)) {
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};

function isLoginRequest(url: string): boolean {
  return /\/auth\/login$/i.test(url);
}

function getTokenFromStorage(): string | null {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as { token?: string };
    return parsedUser.token ?? null;
  } catch {
    return null;
  }
}
