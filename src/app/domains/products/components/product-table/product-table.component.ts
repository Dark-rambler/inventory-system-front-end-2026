import { Component, computed, inject } from '@angular/core';
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
import {
  ConfirmActionDirective,
  EditItemDirective,
  ViewDetailsDirective,
} from '../../../../shared/directives';
import { PRODUCT_COLUMNS } from '../../constants/product-columns.constant';
import { ProductResourceService } from '../../services/product-resource.service';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ConfirmActionDirective,
    ViewDetailsDirective,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent {
  private readonly _productResourceService = inject(ProductResourceService);
  public productData = this._productResourceService.productData;
  public currentPage = this._productResourceService.filterProductParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron productos',
    showLoading: this._productResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));
  protected readonly productColumns = PRODUCT_COLUMNS;

  protected changePage(page: number): void {
    this._productResourceService.filterProductParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._productResourceService.filterProductParameters.update(p => ({ ...p, page: 1, pageSize }));
  }
}
