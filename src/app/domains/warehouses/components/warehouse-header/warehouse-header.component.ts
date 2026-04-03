import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalWarehouseComponent } from '../modal-warehouse/modal-warehouse.component';

@Component({
  selector: 'app-warehouse-header',
  imports: [ButtonComponent],
  templateUrl: './warehouse-header.component.html',
})
export class WarehouseHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  handleNewWarehouse(): void {
    this._dialogService.open(ModalWarehouseComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
