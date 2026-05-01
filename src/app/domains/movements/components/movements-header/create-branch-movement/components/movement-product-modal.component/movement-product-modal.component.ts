import { Component } from '@angular/core';
import { MovementResourceService } from '@app/domains/movements/services/movement-resource.service';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { MovementProductsModalFormComponent } from './movement-products-modal-form/movement-products-modal-form.component';
@Component({
  selector: 'app-movement-product-modal',
  standalone: true,
  providers: [MovementResourceService],
  templateUrl: './movement-product-modal.component.html',
  imports: [ModalComponent, MovementProductsModalFormComponent],
})
export class MovementProductModalComponent {}
