import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Branch } from '@shared/interfaces/branch.interface';
import { getSelectedBranchFromStorage } from '@shared/utils/selected-branch-storage';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface User {
  token: string;
}

export interface TokenPayload {
  [key: string]: unknown;
  unique_name?: string;
  role?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _router = inject(Router);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _selectedBranch = signal<Branch | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly selectedBranch = this._selectedBranch.asReadonly();
  readonly selectedBranchId = computed(() => {
    const branch = this._selectedBranch();
    if (!branch?.id) {
      return null;
    }

    return String(branch.id);
  });

  readonly tokenPayload = computed<TokenPayload | null>(() => {
    const user = this._currentUser();
    if (!user?.token) {
      return null;
    }

    return this._decodeToken(user.token);
  });

  readonly currentUsername = computed(() => this.tokenPayload()?.unique_name ?? null);
  readonly currentRole = computed(() => this.tokenPayload()?.role ?? null);

  get isAuthenticated(): boolean {
    return this._currentUser() !== null;
  }

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._currentUser.set(JSON.parse(storedUser));
    }
    const storedBranch = getSelectedBranchFromStorage<Branch>();
    if (storedBranch) {
      this._selectedBranch.set(storedBranch);
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

  public setSelectedBranch(branch: Branch): void {
    this._selectedBranch.set(branch);
    localStorage.setItem('selectedBranch', JSON.stringify(branch));
  }

  public clearSelectedBranch(): void {
    this._selectedBranch.set(null);
    localStorage.removeItem('selectedBranch');
  }

  public logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem('user');
    this._router.navigate(['/login']);
  }

  private _decodeToken(token: string): TokenPayload | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalizedPayload = payload.padEnd(
        payload.length + ((4 - (payload.length % 4)) % 4),
        '='
      );
      const decoded = atob(normalizedPayload.replace(/-/g, '+').replace(/_/g, '/'));

      return JSON.parse(decoded) as TokenPayload;
    } catch {
      return null;
    }
  }
}
