import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { CustomerResourceService } from '../../../services/customer-resource.service';
import { CustomerService } from '@shared/services/customer.service';

@Directive({
  selector: '[appSendCustomer]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendCustomerDirective {
  public keepOpen = input<boolean>(false);
  private readonly _customerService = inject(CustomerService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _customerResourceService = inject(CustomerResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateCustomer();
      } else {
        this._createCustomer();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createCustomer(): void {
    const form = this._formGroupDirective?.form;
    const customer = form?.value;

    this._customerService
      .create(customer)
      .pipe(
        tap(() => this._customerResourceService.reloadCustomer()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Cliente creado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear el cliente.', 'Error');
        },
      });
  }

  private _updateCustomer(): void {
    const form = this._formGroupDirective?.form;
    const customer = form?.value;

    this._customerService
      .update(customer, this.data.id)
      .pipe(
        tap(() => this._customerResourceService.reloadCustomer()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Cliente actualizado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo actualizar el cliente.', 'Error');
        },
      });
  }
}
