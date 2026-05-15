import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  private readonly _theme = signal<AppTheme>('light');

  readonly currentTheme = this._theme.asReadonly();
  readonly isDarkTheme = computed(() => this._theme() === 'dark');

  public initTheme(): void {
    const initialTheme = this._getStoredTheme() ?? this._getSystemTheme();
    this.setTheme(initialTheme, { persist: false });
  }

  public toggleTheme(): void {
    this.setTheme(this.isDarkTheme() ? 'light' : 'dark');
  }

  public setTheme(theme: AppTheme, options?: { persist?: boolean }): void {
    this._theme.set(theme);
    this._applyThemeClass(theme);

    if (options?.persist === false) {
      return;
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }

  private _applyThemeClass(theme: AppTheme): void {
    const root = this._document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
  }

  private _getStoredTheme(): AppTheme | null {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }

      return null;
    } catch {
      return null;
    }
  }

  private _getSystemTheme(): AppTheme {
    const isDarkPreferred =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

    return isDarkPreferred ? 'dark' : 'light';
  }
}
