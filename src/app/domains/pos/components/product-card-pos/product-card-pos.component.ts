import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ClickAddToCartDirective } from '../../directives/click-add-to-cart.directive';
import { PosProduct } from '../../interfaces/pos.interface';

@Component({
  selector: 'app-product-card-pos',
  imports: [JsonPipe, ClickAddToCartDirective],
  templateUrl: './product-card-pos.component.html',
})
export class ProductCardPosComponent {
  readonly product = input.required<PosProduct>();
}
