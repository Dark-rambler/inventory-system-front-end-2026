import { Component, inject } from '@angular/core';
import { WarehouseFormComponent } from './components/warehouse-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-warehouse',
  imports: [WarehouseFormComponent, ModalComponent],
  templateUrl: './modal-warehouse.component.html',
})
export class ModalWarehouseComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar almacén' : 'Nuevo almacén';
}
