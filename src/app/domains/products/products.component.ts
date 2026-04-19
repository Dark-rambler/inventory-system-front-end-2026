import { Component } from '@angular/core';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductsFiltersComponent } from './components/products-filters/products-filters.component';
import { ProductResourceService } from './services/product-resource.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductHeaderComponent, ProductsFiltersComponent, ProductTableComponent],
  providers: [ProductResourceService],
  templateUrl: './products.component.html',
})
export class ProductsComponent {}
