import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryFilterComponent } from '../category-filter/category-filter.component';

@Component({
  selector: 'app-header-pos',
  imports: [CommonModule, FormsModule, CategoryFilterComponent],
  templateUrl: './header-pos.component.html',
})
export class HeaderPosComponent {
  readonly categories = input<string[]>([]);
  readonly selectedCategory = input<string>('all');

  readonly searchChange = output<string>();
  readonly categoryChange = output<string>();

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }

  selectCategory(category: string): void {
    this.categoryChange.emit(category);
  }
}
