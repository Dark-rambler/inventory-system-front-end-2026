import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <div class="reports-page">
      <div class="page-header">
        <h1 class="page-title">Reportes</h1>
        <p class="page-subtitle">Informes y análisis del sistema</p>
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
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 class="placeholder-title">Sección en desarrollo</h2>
        <p class="placeholder-text">
          Esta sección contendrá reportes detallados, gráficos y exportación de datos.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .reports-page {
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
export class ReportsComponent {}
