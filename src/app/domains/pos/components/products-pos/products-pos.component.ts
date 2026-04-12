import { Component, input, output } from '@angular/core';
import { PaginatorComponent } from '../../../../shared/components/table/components/paginator/paginator.component';
import { PaginatorInterface } from '../../../../shared/interfaces/paginator.interface';
import { PosProduct } from '../../interfaces/pos.interface';
import { HeaderPosComponent } from '../header-pos/header-pos.component';
import { ProductCardPosComponent } from '../product-card-pos/product-card-pos.component';

@Component({
  selector: 'app-products-pos',
  imports: [HeaderPosComponent, ProductCardPosComponent, PaginatorComponent],
  templateUrl: './products-pos.component.html',
})
export class ProductsPosComponent {
  readonly categories = input<string[]>([]);
  readonly selectedCategory = input<string>('all');
  readonly products = input<PosProduct[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly hasError = input<boolean>(false);
  readonly paginator = input<PaginatorInterface<unknown> | null>(null);
  readonly currentPage = input<number>(1);
  readonly currentPageSize = input<number>(12);

  readonly searchChange = output<string>();
  readonly categoryChange = output<string>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }

  onCategoryChange(category: string): void {
    this.categoryChange.emit(category);
  }
}
