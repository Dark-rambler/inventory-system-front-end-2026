import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, delay, tap } from 'rxjs';

export interface User {
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly MOCK_USER: User = {
    username: 'admin',
    token: 'mock-token-123456',
  };

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

  public login(username: string, password: string): Observable<User | null> {
    if (username === 'admin' && password === 'admin') {
      return of(this.MOCK_USER).pipe(
        delay(800),
        tap(user => {
          this._currentUser.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
    }
    return of(null).pipe(delay(800));
  }

  public logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
    this._router.navigate(['/login']);
  }
}
