import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { BusinessFormComponent } from './components/business-form.component';

@Component({
  selector: 'app-modal-business',
  imports: [BusinessFormComponent, ModalComponent],
  templateUrl: './modal-business.component.html',
})
export class ModalBusinessComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar business' : 'Nuevo business';
}
