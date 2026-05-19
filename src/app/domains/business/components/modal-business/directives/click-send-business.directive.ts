import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { BusinessService } from '@shared/services/business.service';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { BusinessResourceService } from '../../../services/business-resource.service';

@Directive({
  selector: '[appSendBusiness]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendBusinessDirective {
  public keepOpen = input<boolean>(false);
  private readonly _businessService = inject(BusinessService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _businessResourceService = inject(BusinessResourceService);
  private readonly _toastrService = inject(ToastrService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateBusiness();
      } else {
        this._createBusiness();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createBusiness(): void {
    const form = this._formGroupDirective?.form;
    const business = form?.value;

    this._businessService
      .create(business)
      .pipe(
        tap(() => this._businessResourceService.reloadBusiness()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Business creado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(error?.message || 'No se pudo crear el business.', 'Error');
        },
      });
  }

  private _updateBusiness(): void {
    const form = this._formGroupDirective?.form;
    const business = form?.value;

    this._businessService
      .update(business, this.data.id)
      .pipe(
        tap(() => this._businessResourceService.reloadBusiness()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe({
        next: () => {
          this._toastrService.success('Business actualizado correctamente.', 'Exito');
        },
        error: error => {
          this._toastrService.error(
            error?.message || 'No se pudo actualizar el business.',
            'Error'
          );
        },
      });
  }
}
