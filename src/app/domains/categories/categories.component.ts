import { Component } from '@angular/core';
import { CategoriesFiltersComponent } from './components/categories-filters/categories-filters.component';
import { CategoryHeaderComponent } from './components/category-header/category-header.component';
import { CategoryTableComponent } from './components/category-table';
import { CategoryResourceService } from './services/category-resource.service';

@Component({
  selector: 'app-categories',
  imports: [CategoryHeaderComponent, CategoriesFiltersComponent, CategoryTableComponent],
  providers: [CategoryResourceService],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {}
