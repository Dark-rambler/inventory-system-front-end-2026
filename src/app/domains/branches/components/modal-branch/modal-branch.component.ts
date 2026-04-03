import { Component, inject } from '@angular/core';
import { BranchFormComponent } from './components/branch-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-branch',
  imports: [BranchFormComponent, ModalComponent],
  templateUrl: './modal-branch.component.html',
})
export class ModalBranchComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar sucursal' : 'Nueva sucursal';
}
