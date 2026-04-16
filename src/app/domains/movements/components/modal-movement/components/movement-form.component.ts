import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { MOVEMENT_FORM_CONTROL } from '../../../constants/movement-form.constant';
import { CreateMovementRequest } from '../../../interfaces/create-movement-request.interface';
import { MovementResourceService } from '../../../services/movement-resource.service';
import { InventoryMovementService } from '../../../../../shared/services/inventory-movement.service';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [ModalComponent, FormInputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './movement-form.component.html',
})
export class MovementFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _movementResourceService = inject(MovementResourceService);
  private readonly _dialog = inject(Dialog);
  private readonly _toastrService = inject(ToastrService);

  protected readonly modalTitle = 'Nuevo movimiento de producto';
  protected movementForm = this._formBuilder.group(MOVEMENT_FORM_CONTROL);
  protected data = inject<{ branchId?: string } | null>(DIALOG_DATA, { optional: true });

  private readonly _guidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  ngOnInit(): void {
    if (this.data?.branchId && this._guidPattern.test(this.data.branchId)) {
      this.movementForm.patchValue({
        fromBranchId: this.data.branchId,
        toBranchId: this.data.branchId,
      });
    }
  }

  protected handleSave(keepOpen = false): void {
    if (!this.movementForm.valid) {
      this.movementForm.markAllAsTouched();
      return;
    }

    const value = this.movementForm.getRawValue();
    const payload: CreateMovementRequest = {
      productId: (value.productId ?? '').trim(),
      quantity: Number(value.quantity),
      type: Number(value.type),
      fromWarehouseId: this._normalizeOptionalGuid(value.fromWarehouseId),
      toWarehouseId: this._normalizeOptionalGuid(value.toWarehouseId),
      fromBranchId: this._normalizeOptionalGuid(value.fromBranchId),
      toBranchId: this._normalizeOptionalGuid(value.toBranchId),
    };

    this._inventoryMovementService
      .create(payload)
      .pipe(
        tap(() => {
          if (this._movementResourceService.isUsingMockData()) {
            this._movementResourceService.appendMockMovement(payload);
          }
        }),
        tap(() => this._movementResourceService.reloadMovement())
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Movimiento creado correctamente.', 'Exito');
          if (keepOpen) {
            this.movementForm.reset({
              productId: '',
              quantity: 0,
              type: 1,
              fromWarehouseId: '',
              toWarehouseId: '',
              fromBranchId: this._isGuid(this.data?.branchId) ? this.data?.branchId : '',
              toBranchId: this._isGuid(this.data?.branchId) ? this.data?.branchId : '',
            });
            return;
          }

          this._dialog.closeAll();
        },
        error: error => {
          this._toastrService.error(this._getErrorMessage(error), 'Error');
        },
      });
  }

  private _isGuid(value: string | null | undefined): value is string {
    return !!value && this._guidPattern.test(value);
  }

  private _normalizeOptionalGuid(value: string | null | undefined): string | null {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : null;
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
