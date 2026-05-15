import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import {
  ActionButtonsComponent,
  IconButtonComponent,
} from '../../../../shared/components/icon-button';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import { EditItemDirective } from '../../../../shared/directives';
import { Category } from '../../../../shared/interfaces/category.interface';
import { CATEGORYCOLUMNS } from '../../constants/category-columns.constant';
import { CategoryResourceService } from '../../services/category-resource.service';
import { ModalCategoryComponent } from '../modal-category/modal-category.component';
import { CategoryService } from '../../../../shared/services/category.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
})
export class CategoryTableComponent {
  private readonly _categoryResourceService = inject(CategoryResourceService);
  private readonly _categoryService = inject(CategoryService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  public categoryData = this._categoryResourceService.categoryData;
  public currentPage = this._categoryResourceService.filterCategoryParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron categorías',
    showLoading: this._categoryResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));
  protected readonly categoryColumns = CATEGORYCOLUMNS;
  protected editCategory(event: Category) {
    this._dialog.open(ModalCategoryComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteCategory(category: Category): void {
    this._confirmModalService
      .open({
        title: 'Eliminar categoría',
        message: `¿Estás seguro de eliminar la categoría "${category.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._categoryService
            .delete(category.id.toString())
            .pipe(
              tap(() => this._categoryResourceService.reloadCategory()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._categoryResourceService.filterCategoryParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._categoryResourceService.filterCategoryParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
