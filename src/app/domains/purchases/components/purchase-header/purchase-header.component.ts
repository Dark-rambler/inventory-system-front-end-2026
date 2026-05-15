import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { ModalPurchaseComponent } from '../modal-purchase/modal-purchase.component';

@Component({
  selector: 'app-purchase-header',
  imports: [ButtonComponent],
  templateUrl: './purchase-header.component.html',
})
export class PurchaseHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected handleNewPurchase(): void {
    this._dialogService.open(ModalPurchaseComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
