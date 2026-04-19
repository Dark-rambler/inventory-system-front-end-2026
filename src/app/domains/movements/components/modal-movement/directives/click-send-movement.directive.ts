import { Dialog } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { CreateMovementRequest } from '../../../interfaces/create-movement-request.interface';
import { MovementResourceService } from '../../../services/movement-resource.service';
import { InventoryMovementService } from '../../../../../shared/services/inventory-movement.service';

@Directive({
  selector: '[appSendMovement]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendMovementDirective {
  public keepOpen = input<boolean>(false);

  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _movementResourceService = inject(MovementResourceService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _toastrService = inject(ToastrService);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (!form?.valid) {
      form?.markAllAsTouched();
      return;
    }

    const value = form.getRawValue();
    const payload: CreateMovementRequest = {
      productId: value.productId ?? '',
      quantity: Number(value.quantity),
      type: Number(value.type),
      fromWarehouseId: value.fromWarehouseId ?? '',
      toWarehouseId: value.toWarehouseId ?? '',
      fromBranchId: value.fromBranchId ?? '',
      toBranchId: value.toBranchId ?? '',
    };

    this._inventoryMovementService
      .create(payload)
      .pipe(
        tap(() => {
          if (this._movementResourceService.isUsingMockData()) {
            this._movementResourceService.appendMockMovement(payload);
          }
        }),
        tap(() => this._movementResourceService.reloadMovement()),
        tap(() => (this.keepOpen() ? form.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Movimiento creado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(this._getErrorMessage(error), 'Error');
        },
      });
  }

  private _getErrorMessage(error: unknown): string {
    const errorResponse = error as {
      error?: {
        title?: string;
        errors?: Record<string, string[]>;
      };
    };

    const validationErrors = errorResponse?.error?.errors;
    if (validationErrors) {
      const messages = Object.values(validationErrors).flat().filter(Boolean);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    return errorResponse?.error?.title || 'No se pudo crear el movimiento.';
  }
}
