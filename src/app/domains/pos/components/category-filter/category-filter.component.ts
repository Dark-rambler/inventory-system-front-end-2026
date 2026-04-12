import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-filter',
  imports: [CommonModule],
  templateUrl: './category-filter.component.html',
})
export class CategoryFilterComponent {
  readonly categories = input<string[]>([]);
  readonly selectedCategory = input<string>('all');
  readonly categoryChange = output<string>();

  selectCategory(category: string): void {
    this.categoryChange.emit(category);
  }
}
