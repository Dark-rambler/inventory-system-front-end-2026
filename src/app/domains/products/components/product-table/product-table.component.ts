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
import { EditItemDirective, ViewDetailsDirective } from '../../../../shared/directives';
import { PRODUCT_COLUMNS } from '../../constants/product-columns.constant';
import { ProductResourceService } from '../../services/product-resource.service';
import { ProductService } from '../../../../shared/services/product.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { tap } from 'rxjs';
import { Product } from '../../../../shared/interfaces/product.interface';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ViewDetailsDirective,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
})
export class ProductTableComponent {
  private readonly _productResourceService = inject(ProductResourceService);
  private readonly _productService = inject(ProductService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

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

  protected editProduct(event: Product): void {
    console.log('Edit product:', event);
  }

  protected deleteProduct(product: Product): void {
    this._confirmModalService
      .open({
        title: 'Eliminar producto',
        message: `¿Estás seguro de eliminar el producto "${product.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._productService
            .delete(product.id)
            .pipe(tap(() => this._productResourceService.reloadProduct()))
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._productResourceService.filterProductParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._productResourceService.filterProductParameters.update(p => ({ ...p, page: 1, pageSize }));
  }
}
