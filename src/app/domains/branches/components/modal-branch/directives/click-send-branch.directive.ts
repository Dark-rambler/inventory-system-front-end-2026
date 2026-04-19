import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { BranchService } from '../../../../../shared/services/branch.service';
import { BranchResourceService } from '../../../services/branch-resource.service';
import { BranchForm } from '../../../../../shared/interfaces/branch.interface';
import { Location } from '@app/shared/interfaces/warehouse.interface';
import { ToastrService } from 'ngx-toastr';

@Directive({
  selector: '[appSendBranch]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendBranchDirective {
  public keepOpen = input<boolean>(false);
  private readonly _branchService = inject(BranchService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _branchResourceService = inject(BranchResourceService);
  protected data = inject(DIALOG_DATA);
  private readonly _toastService = inject(ToastrService);
  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateBranch();
      } else {
        this._createBranch();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createBranch(): void {
    const form = this._formGroupDirective?.form;
    const branch = form?.value;
    const locationBranch: Location = {
      address: branch.address,
      city: branch.city,
    };
    const branchToSend: BranchForm = {
      name: branch.name,
      telephone: branch.telephone,
      Location: locationBranch,
    };
    this._branchService
      .create(branchToSend)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll())),
        tap(() => this._toastService.success('Sucursal creada correctamente.', 'Exito'))
      )
      .subscribe();
  }

  private _updateBranch(): void {
    const form = this._formGroupDirective?.form;
    const branch = form?.value;
    const branchToSend: BranchForm = {
      name: branch.name,
      telephone: branch.telephone,
      Location: {
        address: branch.address,
        city: branch.city,
      },
    };

    this._branchService
      .update(branchToSend, this.data.id)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll())),
        tap(() => this._toastService.success('Sucursal actualizada correctamente.', 'Exito'))
      )
      .subscribe();
  }
}
