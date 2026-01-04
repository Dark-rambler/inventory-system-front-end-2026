import { Component } from '@angular/core';
import { CategoryHeaderComponent } from './components/category-header/category-header.component';
import { CategoryTableComponent } from './components/category-table';
import { CategoryResourceService } from './services/categoryResource.service';

@Component({
  selector: 'app-categories',
  imports: [CategoryHeaderComponent, CategoryTableComponent],
  providers: [CategoryResourceService],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {}
