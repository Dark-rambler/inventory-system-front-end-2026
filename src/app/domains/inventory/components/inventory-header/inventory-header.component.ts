import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalInventoryComponent } from '../modal-inventory/modal-inventory.component';

@Component({
  selector: 'app-inventory-header',
  imports: [ButtonComponent],
  templateUrl: './inventory-header.component.html',
})
export class InventoryHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  handleNewInventory(): void {
    this._dialogService.open(ModalInventoryComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
