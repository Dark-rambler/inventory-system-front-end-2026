import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormDropdownComponent } from '@app/shared/form-dropdown/form-dropdown.component';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { Product } from '@app/shared/interfaces/product.interface';
import { Warehouse } from '@app/shared/interfaces/warehouse.interface';
import { BranchService } from '@app/shared/services/branch.service';
import { ProductService } from '@app/shared/services/product.service';
import { WarehouseService } from '@app/shared/services/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import { startWith, tap } from 'rxjs';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { InventoryMovementService } from '../../../../../shared/services/inventory-movement.service';
import { MOVEMENT_FORM_CONTROL } from '../../../constants/movement-form.constant';
import { CreateMovementRequest } from '../../../interfaces/create-movement-request.interface';
import { MovementResourceService } from '../../../services/movement-resource.service';

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
  private readonly _entryType = 1;
  private readonly _exitType = 0;
  private readonly _transferType = 2;

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _movementResourceService = inject(MovementResourceService);
  private readonly _branchService = inject(BranchService);
  private readonly _dialog = inject(Dialog);
  private readonly _toastrService = inject(ToastrService);
  private readonly _productService = inject(ProductService);

  protected readonly selectedMovementType = signal<number>(this._entryType);
  protected readonly productOptions = signal<Product[]>([]);
  protected readonly typeOptions = [
    { value: this._entryType, label: 'Entrada' },
    { value: this._exitType, label: 'Salida' },
    { value: this._transferType, label: 'Transferencia' },
  ];

  protected readonly showOriginFields = computed(
    () => this.selectedMovementType() !== this._entryType
  );
  protected readonly showDestinationFields = computed(
    () => this.selectedMovementType() !== this._exitType
  );
  protected readonly showSalidaNotes = computed(
    () => this.selectedMovementType() === this._exitType
  );

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

    this._setupDynamicControls();
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
              fromBranchId: '',
              toBranchId: '',
              notes: '',
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

  private _setupDynamicControls(): void {
    const movementTypeControl = this.movementForm.get('type');
    if (!movementTypeControl) {
      return;
    }

    movementTypeControl.valueChanges
      .pipe(startWith(movementTypeControl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        const movementType = this._toMovementType(value);
        this.selectedMovementType.set(movementType);
        this._applyMovementTypeRules(movementType);
      });

    this._watchTransferPair('fromWarehouseId', 'fromBranchId');
    this._watchTransferPair('toWarehouseId', 'toBranchId');
  }

  private _watchTransferPair(primaryControlName: string, secondaryControlName: string): void {
    const primaryControl = this.movementForm.get(primaryControlName);
    const secondaryControl = this.movementForm.get(secondaryControlName);

    if (!primaryControl || !secondaryControl) {
      return;
    }

    primaryControl.valueChanges
      .pipe(startWith(primaryControl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._syncTransferPair(primaryControlName, secondaryControlName));

    secondaryControl.valueChanges
      .pipe(startWith(secondaryControl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._syncTransferPair(primaryControlName, secondaryControlName));
  }

  private _applyMovementTypeRules(movementType: number): void {
    if (movementType === this._entryType) {
      this._clearAndDisableControl('fromWarehouseId');
      this._clearAndDisableControl('fromBranchId');
      this._enableControl('toWarehouseId');
      this._enableControl('toBranchId');
      this._clearControl('notes');
      return;
    }

    if (movementType === this._exitType) {
      this._clearAndDisableControl('toWarehouseId');
      this._clearAndDisableControl('toBranchId');
      this._enableControl('fromWarehouseId');
      this._enableControl('fromBranchId');
      this._enableControl('notes');
      return;
    }

    this._enableControl('fromWarehouseId');
    this._enableControl('fromBranchId');
    this._enableControl('toWarehouseId');
    this._enableControl('toBranchId');
    this._clearControl('notes');

    this._syncTransferPair('fromWarehouseId', 'fromBranchId');
    this._syncTransferPair('toWarehouseId', 'toBranchId');
  }

  private _syncTransferPair(primaryControlName: string, secondaryControlName: string): void {
    if (this.selectedMovementType() !== this._transferType) {
      return;
    }

    const primaryControl = this.movementForm.get(primaryControlName);
    const secondaryControl = this.movementForm.get(secondaryControlName);

    if (!primaryControl || !secondaryControl) {
      return;
    }

    const primaryHasValue = this._hasValue(primaryControl.value);
    const secondaryHasValue = this._hasValue(secondaryControl.value);

    if (primaryHasValue && secondaryHasValue) {
      secondaryControl.setValue('', { emitEvent: false });
    }

    if (primaryHasValue) {
      secondaryControl.setValue('', { emitEvent: false });
      secondaryControl.disable({ emitEvent: false });
      primaryControl.enable({ emitEvent: false });
      return;
    }

    if (secondaryHasValue) {
      primaryControl.setValue('', { emitEvent: false });
      primaryControl.disable({ emitEvent: false });
      secondaryControl.enable({ emitEvent: false });
      return;
    }

    primaryControl.enable({ emitEvent: false });
    secondaryControl.enable({ emitEvent: false });
  }

  private _toMovementType(value: unknown): number {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : this._entryType;
  }

  private _clearAndDisableControl(controlName: string): void {
    const control = this.movementForm.get(controlName);
    if (!control) {
      return;
    }

    control.setValue('', { emitEvent: false });
    control.disable({ emitEvent: false });
  }

  private _enableControl(controlName: string): void {
    const control = this.movementForm.get(controlName);
    if (!control) {
      return;
    }

    control.enable({ emitEvent: false });
  }

  private _clearControl(controlName: string): void {
    const control = this.movementForm.get(controlName);
    if (!control) {
      return;
    }

    control.setValue('', { emitEvent: false });
  }

  private _hasValue(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    return String(value).trim().length > 0;
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
