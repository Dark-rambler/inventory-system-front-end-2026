import { Component, inject, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonComponent } from '../../../../shared/components/button';
import { ModalSupplierComponent } from '../modal-supplier/modal-supplier.component';

@Component({
  selector: 'app-supplier-header',
  imports: [ButtonComponent],
  templateUrl: './supplier-header.component.html',
})
export class SupplierHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  handleNewSupplier(): void {
    this._dialogService.open(ModalSupplierComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
