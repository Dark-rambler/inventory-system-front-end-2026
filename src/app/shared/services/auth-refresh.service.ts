import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment.development';
import { Observable, catchError, finalize, map, of, shareReplay } from 'rxjs';
import { AuthService, User } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthRefreshService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _authService = inject(AuthService);
  private _refreshRequest$: Observable<string | null> | null = null;

  public getStoredAccessToken(): string | null {
    const storedUser = this._getStoredUser();
    return storedUser?.token ?? null;
  }

  public refreshAccessToken(): Observable<string | null> {
    if (this._refreshRequest$) {
      return this._refreshRequest$;
    }

    const refreshToken = this._getStoredRefreshToken();
    if (!refreshToken) {
      return of(null);
    }

    this._refreshRequest$ = this._httpClient
      .post<Record<string, unknown>>(`${environment.API_URL}/Auth/refresh`, {
        refreshToken,
      })
      .pipe(
        map(response => {
          const refreshedUser = this._buildRefreshedUser(response, refreshToken);
          if (!refreshedUser) {
            return null;
          }

          this._authService.updateSession(refreshedUser);
          return refreshedUser.token;
        }),
        catchError(() => of(null)),
        finalize(() => {
          this._refreshRequest$ = null;
        }),
        shareReplay(1)
      );

    return this._refreshRequest$;
  }

  private _getStoredUser(): User | null {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as User;
      return typeof parsedUser?.token === 'string' ? parsedUser : null;
    } catch {
      return null;
    }
  }

  private _getStoredRefreshToken(): string | null {
    const storedUser = this._getStoredUser();
    if (storedUser?.refreshToken) {
      return storedUser.refreshToken;
    }

    return localStorage.getItem('refreshToken');
  }

  private _buildRefreshedUser(
    response: Record<string, unknown>,
    fallbackRefreshToken: string
  ): User | null {
    const token = this._readString(response, ['token', 'accessToken']);
    if (!token) {
      return null;
    }

    const currentUser = this._authService.currentUser();
    const refreshToken =
      this._readString(response, ['refreshToken']) ??
      currentUser?.refreshToken ??
      fallbackRefreshToken;

    return {
      token,
      refreshToken,
    };
  }

  private _readString(value: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const candidate = value[key];
      if (typeof candidate === 'string' && candidate.trim().length > 0) {
        return candidate;
      }
    }

    return null;
  }
}
