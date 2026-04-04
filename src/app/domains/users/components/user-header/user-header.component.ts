import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalUserComponent } from '../modal-user/modal-user.component';

@Component({
  selector: 'app-user-header',
  imports: [ButtonComponent],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss',
})
export class UserHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  handleNewUser(): void {
    this._dialogService.open(ModalUserComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
