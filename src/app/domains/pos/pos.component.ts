import { Component, computed, inject, signal } from '@angular/core';
import { CartPosComponent } from './components/cart-pos/cart-pos.component';
import { ProductsPosComponent } from './components/products-pos/products-pos.component';
import { ProductsPosService } from './services/products-pos.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [ProductsPosComponent, CartPosComponent],
  templateUrl: './pos.component.html',
})
export class PosComponent {
  private readonly _productsService = inject(ProductsPosService);

  readonly _selectedCategory = signal('all');

  readonly isLoading = this._productsService.isLoading;
  readonly hasError = this._productsService.hasError;
  readonly categories = this._productsService.categories;
  readonly paginatorData = this._productsService.paginatorData;
  readonly params = this._productsService.params;

  readonly filteredProducts = computed(() =>
    this._productsService.filterProducts(this._productsService.products(), this._selectedCategory())
  );

  onSearch(term: string): void {
    this._productsService.setSearch(term);
  }

  onCategoryChange(category: string): void {
    this._selectedCategory.set(category);
  }

  onPageChange(page: number): void {
    this._productsService.setPage(page);
  }

  onPageSizeChange(size: number): void {
    this._productsService.setPageSize(size);
  }
}
