import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { BranchService } from '../../../../../shared/services/branch.service';
import { BranchResourceService } from '../../../services/branch-resource.service';

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
    this._branchService
      .create(branch)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }

  private _updateBranch(): void {
    const form = this._formGroupDirective?.form;
    const branch = form?.value;

    this._branchService
      .update(branch, this.data.id)
      .pipe(
        tap(() => this._branchResourceService.reloadBranch()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }
}
