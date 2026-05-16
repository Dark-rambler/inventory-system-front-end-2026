import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthRefreshService } from '@shared/services/auth-refresh.service';
import { AuthService } from '@shared/services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const authRefreshService = inject(AuthRefreshService);
  const token = authService.currentUser()?.token ?? authRefreshService.getStoredAccessToken();
  let request = withAuthHeader(req, token);

  const businessId = authService.getBusinessId();
  request = withBusinessIdHeader(request, businessId);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthRequest(req.url)) {
        return throwError(() => error);
      }

      return authRefreshService.refreshAccessToken().pipe(
        switchMap(newToken => {
          if (!newToken) {
            authService.logout();
            return throwError(() => error);
          }

          const retryRequest = withBusinessIdHeader(withAuthHeader(req, newToken), businessId);
          return next(retryRequest);
        }),
        catchError(refreshError => {
          authService.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};

function isAuthRequest(url: string): boolean {
  return /\/auth\/(login|refresh)$/i.test(url);
}

function withAuthHeader(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token || req.headers.has('Authorization')) {
    return req;
  }

  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
}

function withBusinessIdHeader(
  req: HttpRequest<unknown>,
  businessId: string | null
): HttpRequest<unknown> {
  if (!businessId) {
    return req;
  }

  return req.clone({
    headers: req.headers.set('businessId', businessId),
  });
}
