import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { UserService } from '../../../../../shared/services/user.service';
import { UserResourceService } from '../../../services/user-resource.service';

@Directive({
  selector: '[appSendUser]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendUserDirective {
  public keepOpen = input<boolean>(false);
  private readonly _userService = inject(UserService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _userResourceService = inject(UserResourceService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateUser();
      } else {
        this._createUser();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createUser(): void {
    const form = this._formGroupDirective?.form;
    const user = form?.value;
    this._userService
      .create(user)
      .pipe(
        tap(() => this._userResourceService.reloadUser()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }

  private _updateUser(): void {
    const form = this._formGroupDirective?.form;
    const user = form?.value;

    this._userService
      .update(user, this.data.id)
      .pipe(
        tap(() => this._userResourceService.reloadUser()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }
}
