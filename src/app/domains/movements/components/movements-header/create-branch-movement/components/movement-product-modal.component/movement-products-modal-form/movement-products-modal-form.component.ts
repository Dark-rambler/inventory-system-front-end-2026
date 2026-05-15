import { Component, inject } from '@angular/core';
import { MovementResourceService } from '@app/domains/movements/services/movement-resource.service';
import { FormInputComponent } from '@app/shared/form-input/form-input.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MOVE_PRODUCTS_FORM } from '../constants/move-products-form.constants';
@Component({
  selector: 'app-movement-products-modal-form',
  providers: [MovementResourceService],
  templateUrl: './movement-products-modal-form.component.html',
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule],
})
export class MovementProductsModalFormComponent {
  private readonly fb = inject(FormBuilder);

  protected form = this.fb.group(MOVE_PRODUCTS_FORM);
}
