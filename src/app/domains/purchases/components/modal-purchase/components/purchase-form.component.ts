import { HttpParams } from '@angular/common/http';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormDropdownComponent } from '../../../../../shared/form-dropdown/form-dropdown.component';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { Purchase } from '../../../../../shared/interfaces/purchase.interface';
import { BranchService } from '../../../../../shared/services/branch.service';
import { ProductService } from '../../../../../shared/services/product.service';
import { SupplierService } from '../../../../../shared/services/supplier.service';
import { WarehouseService } from '../../../../../shared/services/warehouse.service';
import { PURCHASE_FORM_CONTROL } from '../../../constants/purchase-form.constant';
import { SendPurchaseDirective } from '../directives/click-send-purchase.directive';

interface PurchaseSelectOption {
  id?: string;
  name: string;
  city?: string;
  code?: string;
  numericId?: number;
}

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    FormInputComponent,
    FormDropdownComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SendPurchaseDirective,
  ],
  templateUrl: './purchase-form.component.html',
})
export class PurchaseFormComponent implements OnInit {
  private static readonly DETAIL_DEFAULT = { productId: '', quantity: 1, price: 0 };
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _supplierService = inject(SupplierService);
  private readonly _branchService = inject(BranchService);
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _productService = inject(ProductService);
  private readonly _destroyRef = inject(DestroyRef);

  protected purchaseForm = this._formBuilder.group({
    ...PURCHASE_FORM_CONTROL,
    purchaseDetails: this._formBuilder.array([this._createPurchaseDetailGroup()]),
  });
  protected data = inject(DIALOG_DATA);
  protected providerOptions = signal<PurchaseSelectOption[]>([]);
  protected branchOptions = signal<PurchaseSelectOption[]>([]);
  protected warehouseOptions = signal<PurchaseSelectOption[]>([]);
  protected productOptions = signal<PurchaseSelectOption[]>([]);

  protected get purchaseDetails(): FormArray {
    return this.purchaseForm.get('purchaseDetails') as FormArray;
  }

  protected get purchaseDetailsControls(): FormGroup[] {
    return this.purchaseDetails.controls as FormGroup[];
  }

  public ngOnInit(): void {
    this._loadOptions();
    this._patchEditData();
    this._setupLocationExclusivity();
  }

  protected showBranchDropdown(): boolean {
    return !this._hasValue(this.purchaseForm.get('warehouseId')?.value);
  }

  protected showWarehouseDropdown(): boolean {
    return !this._hasValue(this.purchaseForm.get('branchId')?.value);
  }

  protected addPurchaseDetail(): void {
    this.purchaseDetails.push(this._createPurchaseDetailGroup());
  }

  protected removePurchaseDetail(index: number): void {
    if (this.purchaseDetails.length === 1) {
      this.purchaseDetails.at(0)?.reset(PurchaseFormComponent.DETAIL_DEFAULT);
      return;
    }

    this.purchaseDetails.removeAt(index);
  }

  private _loadOptions(): void {
    const listParams = this._listParams();
    this._supplierService
      .getAll(listParams)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.providerOptions.set(
          (response.items ?? []).map(item => ({
            id: this._toStringId(item['id']),
            name: String(item['name'] ?? ''),
            city: String(item['city'] ?? ''),
          }))
        );
      });

    this._branchService
      .getAll(listParams)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.branchOptions.set(
          (response.items ?? [])
            .filter(item => item.id !== undefined && item.id !== null)
            .map(item => ({
              id: this._toStringId(item['id']),
              name: String(item['name'] ?? ''),
              city: String(item['city'] ?? ''),
            }))
        );
      });

    this._warehouseService
      .getAll(listParams)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.warehouseOptions.set(
          (response.items ?? [])
            .filter(item => item.id !== undefined && item.id !== null)
            .map(item => ({
              id: this._toStringId(item['id']),
              name: String(item['name'] ?? ''),
              city: String(item['location']?.['city'] ?? ''),
            }))
        );
      });

    this._productService
      .getAll(this._listParams(300))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.productOptions.set(
          (response.items ?? [])
            .map(item => {
              const numericId = this._toPositiveInteger(item['id'], 0);
              return {
                id: this._toStringId(item['id']),
                numericId: numericId > 0 ? numericId : undefined,
                name: String(item['name'] ?? ''),
                code: String(item['code'] ?? ''),
              };
            })
            .filter(item => item.numericId !== undefined)
        );
      });
  }

  private _patchEditData(): void {
    if (!this.data) {
      return;
    }

    const purchase = this.data as Purchase;
    this.purchaseForm.patchValue({
      providerId: this._normalizeId(purchase.providerId ?? purchase.supplierId),
      branchId: this._normalizeId(purchase.branchId),
      warehouseId: this._normalizeId(purchase.warehouseId),
    });

    if (!Array.isArray(purchase.purchaseDetails) || purchase.purchaseDetails.length === 0) {
      return;
    }

    this.purchaseDetails.clear();
    purchase.purchaseDetails.forEach(detail => {
      this.purchaseDetails.push(
        this._createPurchaseDetailGroup({
          productId: this._toPositiveInteger(detail.productId),
          quantity: this._toPositiveInteger(detail.quantity, 1),
          price: this._toPositiveNumber(detail.price),
        })
      );
    });
  }

  private _listParams(pageSize = 200): HttpParams {
    return new HttpParams().set('page', 1).set('pageSize', pageSize);
  }

  private _setupLocationExclusivity(): void {
    const branchControl = this.purchaseForm.get('branchId');
    const warehouseControl = this.purchaseForm.get('warehouseId');
    if (!branchControl || !warehouseControl) {
      return;
    }

    branchControl.valueChanges
      .pipe(startWith(branchControl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        if (this._hasValue(value)) {
          warehouseControl.setValue('', { emitEvent: false });
        }
      });

    warehouseControl.valueChanges
      .pipe(startWith(warehouseControl.value), takeUntilDestroyed(this._destroyRef))
      .subscribe(value => {
        if (this._hasValue(value)) {
          branchControl.setValue('', { emitEvent: false });
        }
      });
  }

  private _normalizeId(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  }

  private _toStringId(value: unknown): string {
    return String(value ?? '').trim();
  }

  private _hasValue(value: unknown): boolean {
    return String(value ?? '').trim().length > 0;
  }

  private _toPositiveInteger(value: unknown, fallback = 1): number {
    const normalizedValue = Number(value);
    if (!Number.isFinite(normalizedValue) || normalizedValue < 1) {
      return fallback;
    }

    return Math.floor(normalizedValue);
  }

  private _toPositiveNumber(value: unknown): number {
    const normalizedValue = Number(value);
    if (!Number.isFinite(normalizedValue) || normalizedValue < 0) {
      return 0;
    }

    return normalizedValue;
  }

  private _createPurchaseDetailGroup(value?: {
    productId?: string | number;
    quantity?: number;
    price?: number;
  }): FormGroup {
    return this._formBuilder.group({
      productId: [
        value?.productId ?? PurchaseFormComponent.DETAIL_DEFAULT.productId,
        [Validators.required],
      ],
      quantity: [value?.quantity ?? 1, [Validators.required, Validators.min(1)]],
      price: [value?.price ?? 0, [Validators.required, Validators.min(0)]],
    });
  }
}
