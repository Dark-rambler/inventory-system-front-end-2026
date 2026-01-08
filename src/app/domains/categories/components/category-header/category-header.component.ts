import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';

@Component({
  selector: 'app-category-header',
  imports: [ButtonComponent],
  templateUrl: './category-header.component.html',
  styleUrl: './category-header.component.scss',
})
export class CategoryHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  handleNewCategory(): void {
    this._dialogService.open(ModalCategoryComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
