import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { PurchaseFormComponent } from './components/purchase-form.component';

@Component({
  selector: 'app-modal-purchase',
  imports: [PurchaseFormComponent, ModalComponent],
  templateUrl: './modal-purchase.component.html',
})
export class ModalPurchaseComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar compra' : 'Nueva compra';
}
