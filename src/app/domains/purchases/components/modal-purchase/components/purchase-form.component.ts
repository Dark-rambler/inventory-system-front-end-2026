import { HttpParams } from '@angular/common/http';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormDropdownComponent } from '../../../../../shared/form-dropdown/form-dropdown.component';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { Purchase } from '../../../../../shared/interfaces/purchase.interface';
import { Supplier } from '../../../../../shared/interfaces/supplier.interface';
import { SupplierService } from '../../../../../shared/services/supplier.service';
import {
  PURCHASE_PAYMENT_METHOD_OPTIONS,
  PURCHASE_STATUS_OPTIONS,
} from '../../../constants/purchase-options.constant';
import { PURCHASE_FORM_CONTROL } from '../../../constants/purchase-form.constant';
import { SendPurchaseDirective } from '../directives/click-send-purchase.directive';

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
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _supplierService = inject(SupplierService);
  private readonly _destroyRef = inject(DestroyRef);

  protected purchaseForm = this._formBuilder.group(PURCHASE_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);
  protected supplierOptions = signal<Supplier[]>([]);
  protected statusOptions = PURCHASE_STATUS_OPTIONS;
  protected paymentMethodOptions = PURCHASE_PAYMENT_METHOD_OPTIONS;

  public ngOnInit(): void {
    this.loadSuppliers();
    this.loadData();
  }

  protected onSupplierSelected(option: unknown): void {
    const supplier = option as Partial<Supplier>;
    this.purchaseForm.patchValue({
      supplierName: String(supplier.name ?? '').trim(),
    });
  }

  private loadSuppliers(): void {
    const params = new HttpParams().set('page', 1).set('pageSize', 200);

    this._supplierService
      .getAll(params)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.supplierOptions.set(response.items ?? []);
      });
  }

  private loadData(): void {
    if (!this.data) {
      return;
    }

    const purchase = this.data as Purchase;
    this.purchaseForm.patchValue({
      ...purchase,
      supplierId: purchase.supplierId ? String(purchase.supplierId) : '',
      expectedDate: this._toDateInputValue(purchase.expectedDate),
    });
  }

  private _toDateInputValue(value: string | null | undefined): string {
    return String(value ?? '').slice(0, 10);
  }
}
