import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory',
  standalone: true,
  template: `
    <div class="inventory-page">
      <div class="page-header">
        <h1 class="page-title">Inventario</h1>
        <p class="page-subtitle">Gestión de stock y movimientos de inventario</p>
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
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h2 class="placeholder-title">Sección en desarrollo</h2>
        <p class="placeholder-text">
          Aquí podrás gestionar el inventario completo, realizar ajustes de stock y ver movimientos.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .inventory-page {
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
export class InventoryComponent {}
