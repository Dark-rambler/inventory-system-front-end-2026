import { Component } from '@angular/core';
import { CategoryFormComponent } from './components/category-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-category',
  imports: [CategoryFormComponent, ModalComponent],
  templateUrl: './modal-category.component.html',
})
export class ModalCategoryComponent {}
