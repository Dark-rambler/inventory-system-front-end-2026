import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { PurchaseService } from '../../../../../shared/services/purchase.service';
import { PurchaseResourceService } from '../../../services/purchase-resource.service';

@Directive({
  selector: '[appSendPurchase]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendPurchaseDirective {
  public keepOpen = input<boolean>(false);
  private readonly _purchaseService = inject(PurchaseService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _purchaseResourceService = inject(PurchaseResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  protected onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updatePurchase();
      } else {
        this._createPurchase();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createPurchase(): void {
    const form = this._formGroupDirective?.form;
    const purchase = form?.value;

    this._purchaseService
      .create(purchase)
      .pipe(
        tap(() => this._purchaseResourceService.reloadPurchases()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Compra creada correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear la compra.', 'Error');
        },
      });
  }

  private _updatePurchase(): void {
    const form = this._formGroupDirective?.form;
    const purchase = form?.value;

    this._purchaseService
      .update(purchase, this.data.id)
      .pipe(
        tap(() => this._purchaseResourceService.reloadPurchases()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Compra actualizada correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo actualizar la compra.', 'Error');
        },
      });
  }
}
