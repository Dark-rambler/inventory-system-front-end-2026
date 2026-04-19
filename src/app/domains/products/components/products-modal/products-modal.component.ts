import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { ProductsFormComponent } from './components/products-form/products-form.component';

@Component({
  selector: 'app-products-modal',
  imports: [ProductsFormComponent, ModalComponent],
  templateUrl: './products-modal.component.html',
})
export class ProductsModalComponent {
  protected data = inject(DIALOG_DATA);
  protected modalName = this.data ? 'Editar producto' : 'Nuevo producto';
}
