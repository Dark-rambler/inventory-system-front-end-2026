import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Branch } from '@shared/interfaces/branch.interface';
import { getSelectedBranchFromStorage } from '@shared/utils/selected-branch-storage';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface User {
  token: string;
  refreshToken?: string;
}

export interface TokenPayload {
  [key: string]: unknown;
  unique_name?: string;
  role?: string;
  exp?: number;
  businessName: string;
  businessId: string;
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
    const user = this._currentUser();
    return !!user?.token && !this._isTokenExpired(user.token);
  }

  constructor() {
    const storedUser = this._getStoredUser();
    if (storedUser && !this._isTokenExpired(storedUser.token)) {
      this._currentUser.set(storedUser);
    } else if (storedUser) {
      this.clearSession();
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
          this.updateSession(user);
        })
      );
  }

  public updateSession(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));

    if (user.refreshToken) {
      localStorage.setItem('refreshToken', user.refreshToken);
    }
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
    this.clearSession();
    this._router.navigate(['/login']);
  }

  public clearSession(): void {
    this._currentUser.set(null);
    this._selectedBranch.set(null);
    localStorage.clear();
  }

  private _getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      return typeof parsedUser?.token === 'string' ? parsedUser : null;
    } catch {
      return null;
    }
  }

  private _isTokenExpired(token: string): boolean {
    const payload = this._decodeToken(token);
    if (!payload?.exp) {
      return true;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= currentTimeInSeconds;
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

  public getBusinessId(): string | null {
    return this.tokenPayload()?.businessId ?? null;
  }

  public getBusinessName(): string | null {
    return this.tokenPayload()?.businessName ?? null;
  }
}
