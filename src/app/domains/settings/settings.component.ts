import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h1 class="page-title">Configuración</h1>
        <p class="page-subtitle">Ajustes y preferencias del sistema</p>
      </div>

      <div class="placeholder-content">
        <div class="placeholder-icon">
          <svg
            class="w-24 h-24 text-gray-300"
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
        <h2 class="placeholder-title">Sección en desarrollo</h2>
        <p class="placeholder-text">
          Aquí podrás configurar preferencias de usuario, notificaciones y ajustes del sistema.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-page {
        @apply space-y-6;
      }

      .page-header {
        @apply mb-8;
      }

      .page-title {
        @apply text-3xl font-bold text-[#1E1E1E] mb-2;
      }

      .page-subtitle {
        @apply text-sm text-gray-600;
      }

      .placeholder-content {
        @apply flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl shadow-sm;
      }

      .placeholder-icon {
        @apply mb-6;
      }

      .placeholder-title {
        @apply text-2xl font-semibold text-gray-700 mb-3;
      }

      .placeholder-text {
        @apply text-gray-500 text-center max-w-md;
      }
    `,
  ],
})
export class SettingsComponent {}
