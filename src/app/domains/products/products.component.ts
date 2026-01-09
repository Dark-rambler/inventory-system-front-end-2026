import { Component } from '@angular/core';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductResourceService } from './services/product-resource.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductHeaderComponent, ProductTableComponent],
  providers: [ProductResourceService],
  templateUrl: './products.component.html',
})
export class ProductsComponent {}
