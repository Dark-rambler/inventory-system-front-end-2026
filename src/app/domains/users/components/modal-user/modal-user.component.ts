import { Component, inject } from '@angular/core';
import { UserFormComponent } from './components/user-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-user',
  imports: [UserFormComponent, ModalComponent],
  templateUrl: './modal-user.component.html',
})
export class ModalUserComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar usuario' : 'Nuevo usuario';
}
