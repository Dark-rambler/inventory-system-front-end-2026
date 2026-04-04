import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ButtonComponent } from '../button';
import { Dialog } from '@angular/cdk/dialog';

export type ConfirmModalResult = 'confirm' | 'cancel';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-2xl relative w-96">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h3 class="text-lg font-semibold text-center text-gray-800 mb-2">{{ title() }}</h3>
        <p class="text-sm text-gray-600 text-center mb-6">{{ message() }}</p>

        <div class="flex justify-center space-x-3">
          <app-button variant="outline" size="md" label="Cancelar" (buttonClick)="onCancel()" />
          <app-button variant="danger" size="md" label="Confirmar" (buttonClick)="onConfirm()" />
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModalComponent {
  readonly title = input<string>('Confirmar acción');
  readonly message = input<string>('¿Estás seguro de realizar esta acción?');
  readonly confirm = output<ConfirmModalResult>();
  private readonly _dialog = inject(Dialog);
  protected onConfirm(): void {
    this.confirm.emit('confirm');
  }

  protected onCancel(): void {
    this.confirm.emit('cancel');
    this._dialog.closeAll();
  }
}
