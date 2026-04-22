import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpParams } from '@angular/common/http';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormDropdownComponent } from '@app/shared/form-dropdown/form-dropdown.component';
import { Product } from '@app/shared/interfaces/product.interface';
import { ProductService } from '@app/shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { InventoryMovementService } from '../../../../../shared/services/inventory-movement.service';
import { MOVEMENT_FORM_CONTROL } from '../../../constants/movement-form.constant';
import { CreateMovementRequest } from '../../../interfaces/create-movement-request.interface';
import { MovementResourceService } from '../../../services/movement-resource.service';
import { Warehouse } from '@app/shared/interfaces/warehouse.interface';
import { WarehouseService } from '@app/shared/services/warehouse.service';
import { BranchService } from '@app/shared/services/branch.service';
import { Branch } from '@app/shared/interfaces/branch.interface';

@Component({
  selector: 'app-movement-form',
  standalone: true,
  imports: [
    ModalComponent,
    FormInputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    FormDropdownComponent,
  ],
  templateUrl: './movement-form.component.html',
})
export class MovementFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _movementResourceService = inject(MovementResourceService);
  private readonly _branchService = inject(BranchService);
  private readonly _dialog = inject(Dialog);
  private readonly _toastrService = inject(ToastrService);
  private readonly _productService = inject(ProductService);
  protected readonly productOptions = signal<Product[]>([]);
  protected readonly typeOptions = [
    { value: 1, label: 'Entrada' },
    { value: 0, label: 'Salida' },
  ];
  protected readonly warehouseOptions = signal<Warehouse[]>([]);
  protected readonly branchOptions = signal<Branch[]>([]);
  protected readonly modalTitle = 'Nuevo movimiento de producto';
  protected movementForm = this._formBuilder.group(MOVEMENT_FORM_CONTROL);
  public branchId = input<string | null>(null);
  protected data = inject<{ branchId?: string } | null>(DIALOG_DATA, { optional: true });
  private readonly _warehouseService = inject(WarehouseService);
  ngOnInit(): void {
    const initialBranchId = this._getInitialBranchId();
    this.loadproducts();
    this.loadWarehouses(initialBranchId);
    this.loadBranch();
    if (initialBranchId) {
      this.movementForm.patchValue({
        fromBranchId: initialBranchId,
        toBranchId: initialBranchId,
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
              fromBranchId: this._getInitialBranchId() ?? '',
              toBranchId: this._getInitialBranchId() ?? '',
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

  private _getInitialBranchId(): string | null {
    const branchIdFromInput = this.branchId()?.trim();
    if (branchIdFromInput) {
      return branchIdFromInput;
    }

    const branchIdFromDialog = this.data?.branchId?.trim();
    return branchIdFromDialog || null;
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
  private loadproducts(): void {
    const params = new HttpParams().set('page', '1').set('pageSize', '100');
    this._productService
      .getAll(params)
      .pipe(tap(products => this.productOptions.set(products.items)))
      .subscribe();
  }

  private loadWarehouses(branchId: string | null): void {
    if (!branchId) {
      this.warehouseOptions.set([]);
      return;
    }

    const params = new HttpParams().set('page', '1').set('pageSize', '100');
    this._warehouseService
      .getAll(params)
      .pipe(tap(response => this.warehouseOptions.set(response.items)))
      .subscribe();
  }
  private loadBranch(): void {
    this._branchService
      .getAll(new HttpParams().set('page', '1').set('pageSize', '100'))
      .pipe(tap(response => this.branchOptions.set(response.items)))
      .subscribe();
  }
}
