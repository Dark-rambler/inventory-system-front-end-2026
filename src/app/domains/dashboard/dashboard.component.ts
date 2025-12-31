import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Vista general del sistema de inventario</p>
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h2 class="placeholder-title">Sección en desarrollo</h2>
        <p class="placeholder-text">
          Esta sección mostrará estadísticas, gráficos y métricas clave del inventario.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
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
export class DashboardComponent {}
