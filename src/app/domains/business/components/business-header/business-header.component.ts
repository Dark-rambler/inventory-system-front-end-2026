import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '@shared/components/button';
import { ModalBusinessComponent } from '../modal-business/modal-business.component';

@Component({
  selector: 'app-business-header',
  imports: [ButtonComponent],
  templateUrl: './business-header.component.html',
})
export class BusinessHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected handleNewBusiness(): void {
    this._dialogService.open(ModalBusinessComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
