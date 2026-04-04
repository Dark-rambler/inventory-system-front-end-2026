import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { BranchService } from '../../../../../shared/services/branch.service';
import { BranchResourceService } from '../../../services/branch-resource.service';
import { Branch } from '../../../../../shared/interfaces/branch.interface';

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
    const branchToSend: Branch = {
      name: branch.name,
      telephone: branch.telephone,
      address: branch.address,
      city: branch.city,
    };
    this._branchService
      .create(branchToSend)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }

  private _updateBranch(): void {
    const form = this._formGroupDirective?.form;
    const branch = form?.value;
    const branchToSend: Branch = {
      name: branch.name,
      telephone: branch.telephone,
      address: branch.address,
      city: branch.city,
    };

    this._branchService
      .update(branchToSend, this.data.id)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }
}
