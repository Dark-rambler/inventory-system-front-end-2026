import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { SupplierFormComponent } from './components/supplier-form.component';

@Component({
  selector: 'app-modal-supplier',
  imports: [SupplierFormComponent, ModalComponent],
  templateUrl: './modal-supplier.component.html',
})
export class ModalSupplierComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar proveedor' : 'Nuevo proveedor';
}
