import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';

@Component({
  selector: 'app-category-header',
  imports: [ButtonComponent],
  templateUrl: './category-header.component.html',
  styleUrl: './category-header.component.scss',
})
export class CategoryHeaderComponent {
  handleNewCategory(): void {
    console.log('agrega nueva categoria');
  }
}
