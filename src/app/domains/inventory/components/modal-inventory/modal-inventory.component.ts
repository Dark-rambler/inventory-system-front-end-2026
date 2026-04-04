import { Component, inject } from '@angular/core';
import { InventoryFormComponent } from './components/inventory-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-inventory',
  imports: [InventoryFormComponent, ModalComponent],
  templateUrl: './modal-inventory.component.html',
})
export class ModalInventoryComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar inventario' : 'Nuevo inventario';
}
