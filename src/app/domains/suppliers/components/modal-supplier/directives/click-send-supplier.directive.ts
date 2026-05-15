import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { SupplierService } from '../../../../../shared/services/supplier.service';
import { SupplierResourceService } from '../../../services/supplier-resource.service';

@Directive({
  selector: '[appSendSupplier]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendSupplierDirective {
  public keepOpen = input<boolean>(false);
  private readonly _supplierService = inject(SupplierService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _supplierResourceService = inject(SupplierResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateSupplier();
      } else {
        this._createSupplier();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createSupplier(): void {
    const form = this._formGroupDirective?.form;
    const supplier = form?.value;

    this._supplierService
      .create(supplier)
      .pipe(
        tap(() => this._supplierResourceService.reloadSuppliers()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Proveedor creado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear el proveedor.', 'Error');
        },
      });
  }

  private _updateSupplier(): void {
    const form = this._formGroupDirective?.form;
    const supplier = form?.value;

    this._supplierService
      .update(supplier, this.data.id)
      .pipe(
        tap(() => this._supplierResourceService.reloadSuppliers()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Proveedor actualizado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(
            error?.message || 'No se pudo actualizar el proveedor.',
            'Error'
          );
        },
      });
  }
}
