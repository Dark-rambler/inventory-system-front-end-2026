import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { CustomerFormComponent } from './components/customer-form.component';

@Component({
  selector: 'app-modal-customer',
  imports: [CustomerFormComponent, ModalComponent],
  templateUrl: './modal-customer.component.html',
})
export class ModalCustomerComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar cliente' : 'Nuevo cliente';
}
