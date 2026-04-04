import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface User {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  get isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._currentUser.set(JSON.parse(storedUser));
    }
  }

  public login(userName: string, password: string): Observable<User> {
    return this._httpClient
      .post<User>(`${environment.API_URL}/Auth/login`, { userName, password })
      .pipe(
        tap(user => {
          this._currentUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  public logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
    this._router.navigate(['/login']);
  }
}
