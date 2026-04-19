import { Component } from '@angular/core';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { MovementFormComponent } from './components/movement-form.component';

@Component({
  selector: 'app-modal-movement',
  standalone: true,
  imports: [MovementFormComponent, ModalComponent],
  templateUrl: './modal-movement.component.html',
})
export class ModalMovementComponent {
  protected modalName = 'Nuevo movimiento de producto';
}
