import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';

@Component({
  selector: 'app-product-header',
  imports: [ButtonComponent],
  templateUrl: './product-header.component.html',
})
export class ProductHeaderComponent {
  handleNewProduct(): void {
    console.log('agrega nuevo producto');
  }
}
