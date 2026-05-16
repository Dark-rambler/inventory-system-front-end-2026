import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormArray, FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Purchase } from '../../../../../shared/interfaces/purchase.interface';
import { PurchaseService } from '../../../../../shared/services/purchase.service';
import { CreatePurchaseRequest } from '../../../interfaces/create-purchase-request.interface';
import { PurchaseResourceService } from '../../../services/purchase-resource.service';

interface PurchaseDetailFormValue {
  productId: unknown;
  quantity: unknown;
  price: unknown;
}

interface PurchaseFormValue {
  providerId: unknown;
  branchId: unknown;
  warehouseId: unknown;
  purchaseDetails: PurchaseDetailFormValue[];
}

@Directive({
  selector: '[appSendPurchase]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendPurchaseDirective {
  private static readonly DETAIL_DEFAULT = { productId: '', quantity: 1, price: 0 };
  public keepOpen = input<boolean>(false);
  private readonly _purchaseService = inject(PurchaseService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _purchaseResourceService = inject(PurchaseResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  protected onClick(): void {
    const form = this._formGroupDirective?.form;
    if (!form) {
      return;
    }

    if (!form.valid) {
      form?.markAllAsTouched();
      return;
    }

    const payload = this._buildPayload(form.getRawValue() as PurchaseFormValue);
    if (!payload) {
      return;
    }

    this._request(payload)
      .pipe(
        tap(() => this._purchaseResourceService.reloadPurchases()),
        tap(() => (this.keepOpen() ? this._resetForm(form) : this._dialog.closeAll()))
      )
      .subscribe({
        next: () =>
          this._toastrService.success(
            this.data ? 'Compra actualizada correctamente.' : 'Compra creada correctamente.',
            'Exito'
          ),
        error: error => this._toastrService.error(error?.message || this._errorMessage(), 'Error'),
      });
  }

  private _request(payload: CreatePurchaseRequest): Observable<Purchase> {
    return this.data
      ? this._purchaseService.update(payload, this.data.id)
      : this._purchaseService.create(payload);
  }

  private _buildPayload(value: PurchaseFormValue): CreatePurchaseRequest | null {
    const purchaseDetails = Array.isArray(value.purchaseDetails)
      ? value.purchaseDetails
          .map(detail => {
            const productId = this._toIntegerId(detail.productId);
            if (productId === null) {
              return null;
            }

            return {
              productId,
              quantity: Number(detail.quantity ?? 0),
              price: Number(detail.price ?? 0),
            };
          })
          .filter(
            (
              detail
            ): detail is {
              productId: number;
              quantity: number;
              price: number;
            } => detail !== null
          )
      : [];

    if (purchaseDetails.length === 0) {
      return null;
    }

    return {
      providerId: this._normalizeId(value.providerId),
      branchId: this._normalizeId(value.branchId),
      warehouseId: this._normalizeId(value.warehouseId),
      purchaseDetails,
    };
  }

  private _resetForm(form: FormGroupDirective['form']): void {
    form.reset({
      providerId: '',
      branchId: '',
      warehouseId: '',
    });

    const purchaseDetails = form.get('purchaseDetails');
    if (!(purchaseDetails instanceof FormArray)) {
      return;
    }

    while (purchaseDetails.length > 1) {
      purchaseDetails.removeAt(purchaseDetails.length - 1);
    }

    purchaseDetails.at(0)?.reset({
      productId: SendPurchaseDirective.DETAIL_DEFAULT.productId,
      quantity: SendPurchaseDirective.DETAIL_DEFAULT.quantity,
      price: SendPurchaseDirective.DETAIL_DEFAULT.price,
    });
  }

  private _normalizeId(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  }

  private _toIntegerId(value: unknown): number | null {
    const normalizedValue = Number(value);
    if (!Number.isInteger(normalizedValue) || normalizedValue < 1) {
      return null;
    }

    return normalizedValue;
  }

  private _errorMessage(): string {
    return this.data ? 'No se pudo actualizar la compra.' : 'No se pudo crear la compra.';
  }
}
