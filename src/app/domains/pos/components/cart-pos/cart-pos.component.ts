import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartPosService } from '../../services/cart-pos.service';

@Component({
  selector: 'app-cart-pos',
  imports: [CommonModule],
  templateUrl: './cart-pos.component.html',
})
export class CartPosComponent {
  private readonly _cartService = inject(CartPosService);
  readonly cart = this._cartService.cart;
  readonly subtotal = this._cartService.subtotal;
  readonly tax = this._cartService.tax;
  readonly total = this._cartService.total;
  readonly isEmpty = this._cartService.isEmpty;
  readonly saleProcessed = output<number>();

  removeFromCart(productId: string): void {
    this._cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, change: number): void {
    this._cartService.updateQuantity(productId, change);
  }

  clearCart(): void {
    this._cartService.clearCart();
  }

  processSale(): void {
    const total = this._cartService.processSale();
    if (total > 0) {
      this.saleProcessed.emit(total);
    }
  }
}
