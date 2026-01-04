import { Component, computed, inject } from '@angular/core';
import {
  ActionButtonsComponent,
  IconButtonComponent,
} from '../../../../shared/components/icon-button';
import {
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import {
  ConfirmActionDirective,
  EditItemDirective,
  ViewDetailsDirective,
} from '../../../../shared/directives';
import { CATEGORYCOLUMNS } from '../../constants/category-columns.constant';
import { CategoryResourceService } from '../../services/categoryResource.service';

@Component({
  selector: 'app-category-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ConfirmActionDirective,
    ViewDetailsDirective,
    EditItemDirective,
  ],
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
})
export class CategoryTableComponent {
  private readonly _categoryResourceService = inject(CategoryResourceService);
  public categoryData = this._categoryResourceService.categoryData;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron categorías',
    showLoading: this._categoryResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));
  protected readonly categoryColumns = CATEGORYCOLUMNS;
}
