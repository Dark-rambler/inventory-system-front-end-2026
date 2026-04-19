import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { ClickAddProductModalDirective } from '../directives/click-add-product-modal.directive';

@Component({
  selector: 'app-product-header',
  imports: [ButtonComponent, ClickAddProductModalDirective],
  templateUrl: './product-header.component.html',
})
export class ProductHeaderComponent {
  handleNewProduct(): void {
    console.log('agrega nuevo producto');
  }
}
