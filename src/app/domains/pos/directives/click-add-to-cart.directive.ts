import { Directive, inject } from '@angular/core';
import { CartPosService } from '../services/cart-pos.service';
import { PosProduct } from '../interfaces/pos.interface';

@Directive({
  selector: '[appClickAddToCart]',
  host: {
    '(click)': 'addToCart($event)',
  },
})
export class ClickAddToCartDirective {
  private readonly _cartService = inject(CartPosService);

  addToCart(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const productData = target.getAttribute('data-product');
    if (productData) {
      const product: PosProduct = JSON.parse(productData);
      this._cartService.addToCart(product);
    }
  }
}
