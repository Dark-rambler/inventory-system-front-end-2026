import { computed, inject, Injectable, signal } from '@angular/core';
import { CartItem, PosProduct } from '../interfaces/pos.interface';
import { ProductsPosService } from './products-pos.service';

@Injectable({
  providedIn: 'root',
})
export class CartPosService {
  private readonly _productsService = inject(ProductsPosService);
  private readonly _cart = signal<CartItem[]>([]);

  readonly cart = this._cart.asReadonly();

  readonly isEmpty = computed(() => this._cart().length === 0);

  readonly subtotal = computed(() => this._cart().reduce((sum, item) => sum + item.subtotal, 0));

  readonly tax = computed(() => this.subtotal() * 0.16);

  readonly total = computed(() => this.subtotal() + this.tax());

  addToCart(product: PosProduct): void {
    const currentStock =
      this._productsService.products().find(p => p.id === product.id)?.stock ?? 0;
    if (currentStock <= 0) return;

    this._cart.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
            : i
        );
      }
      return [...items, { ...product, quantity: 1, subtotal: product.price }];
    });
    this._productsService.reduceStock(product.id);
  }

  removeFromCart(productId: string): void {
    const item = this._cart().find(i => i.id === productId);
    if (item) {
      this._productsService.restoreStock(productId, item.quantity);
    }
    this._cart.update(items => items.filter(i => i.id !== productId));
  }

  updateQuantity(productId: string, change: number): void {
    this._cart.update(items =>
      items.map(i => {
        if (i.id === productId) {
          const currentStock =
            this._productsService.products().find(p => p.id === productId)?.stock ?? 0;
          const canIncrease = change > 0 && currentStock > 0;
          const canDecrease = change < 0 && i.quantity > 1;

          if (change > 0 && !canIncrease) return i;
          if (change < 0 && !canDecrease) return i;

          const newQty = i.quantity + change;
          if (change > 0) this._productsService.reduceStock(productId);
          if (change < 0) this._productsService.restoreStock(productId);
          return { ...i, quantity: newQty, subtotal: newQty * i.price };
        }
        return i;
      })
    );
  }

  clearCart(): void {
    this._cart().forEach(item => this._productsService.restoreStock(item.id, item.quantity));
    this._cart.set([]);
  }

  processSale(): number {
    if (this._cart().length === 0) return 0;
    const total = this.total();
    alert(`Venta procesada por $${total.toFixed(2)}\n¡Gracias por su compra!`);
    this._cart.set([]);
    return total;
  }
}
