import { Component, inject } from '@angular/core';
import { ThemeService } from '@shared/services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="space-y-6">
      <div class="mb-8">
        <h1 class="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Configuración</h1>
        <p class="text-sm text-gray-600 dark:text-slate-400">Ajustes y preferencias del sistema</p>
      </div>

      <section
        class="mb-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center"
      >
        <div>
          <h2 class="text-base font-semibold text-slate-800 dark:text-slate-100">
            Tema de la aplicación
          </h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Cambia entre modo claro y oscuro. La preferencia se guarda automáticamente.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary-400/40 dark:hover:text-primary-300"
          (click)="toggleTheme()"
        >
          @if (isDarkMode()) {
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 3v2m0 14v2m7-9h2M3 12H1m15.364 6.364l1.414 1.414M6.222 6.222L4.808 4.808m12.728 0l-1.414 1.414M6.222 17.778l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
            <span>Modo claro</span>
          } @else {
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20.354 15.354A9 9 0 118.646 3.646a7 7 0 1011.708 11.708z"
              />
            </svg>
            <span>Modo oscuro</span>
          }
        </button>
      </section>

      <div
        class="flex flex-col items-center justify-center rounded-xl bg-white px-4 py-20 shadow-sm dark:bg-slate-900"
      >
        <div class="mb-6">
          <svg
            class="h-24 w-24 text-gray-300 dark:text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2 class="mb-3 text-2xl font-semibold text-gray-700 dark:text-slate-200">
          Sección en desarrollo
        </h2>
        <p class="max-w-md text-center text-gray-500 dark:text-slate-400">
          Aquí podrás configurar preferencias de usuario, notificaciones y ajustes del sistema.
        </p>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  private readonly _themeService = inject(ThemeService);

  protected readonly isDarkMode = this._themeService.isDarkTheme;

  protected toggleTheme(): void {
    this._themeService.toggleTheme();
  }
}
