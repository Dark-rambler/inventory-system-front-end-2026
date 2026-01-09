import { Component, inject } from '@angular/core';
import { CategoryFormComponent } from './components/category-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-category',
  imports: [CategoryFormComponent, ModalComponent],
  templateUrl: './modal-category.component.html',
})
export class ModalCategoryComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar categoría' : 'Nueva categoría';
}
