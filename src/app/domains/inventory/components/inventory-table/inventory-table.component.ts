import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
  ViewContainerRef,
} from '@angular/core';
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
import { ButtonComponent } from '../../../../shared/components/button';
import { EditItemDirective } from '../../../../shared/directives';
import { Inventory } from '../../interfaces/inventory.interface';
import { INVENTORYCOLUMNS } from '../../constants/inventory-columns.constant';
import { InventoryResourceService } from '../../services/inventory-resource.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ModalInventoryComponent } from '../modal-inventory/modal-inventory.component';
import { catchError, finalize, of, tap } from 'rxjs';
import { BranchService } from '@app/shared/services/branch.service';
import { ActivatedRoute } from '@angular/router';
import { BranchMissingProductsResourceService } from '@app/domains/movements/services/branch-missing-products-resource.service';
import { ToastrService } from 'ngx-toastr';

type EditableField = 'price' | 'stock' | 'lowStock';

interface EditableValues {
  price: number | null;
  stock: number | null;
  lowStock: number | null;
}

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    ButtonComponent,
    PaginatorComponent,
  ],
  templateUrl: './inventory-table.component.html',
})
export class InventoryTableComponent implements OnInit {
  showEditVIew = input<boolean>(true);
  private readonly _route = inject(ActivatedRoute);
  private readonly _inventoryResourceService = inject(InventoryResourceService);
  private readonly _branchService = inject(BranchService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _branchMissingProductsResourceService = inject(
    BranchMissingProductsResourceService
  );
  private readonly _toastrService = inject(ToastrService);

  public inventoryData = this._inventoryResourceService.inventoryData;
  public currentPage = this._inventoryResourceService.filterInventoryParameters;
  protected readonly editingRowId = signal<string | null>(null);
  protected readonly selectedInventoryIds = signal<string[]>([]);
  protected readonly isDeletingSelected = signal<boolean>(false);
  private readonly _editableValues = signal<Record<string, EditableValues>>({});
  protected inventoryColumns = INVENTORYCOLUMNS;

  private _findBranchId(): string | null {
    let route: ActivatedRoute | null = this._route;
    while (route) {
      const id = route.snapshot.paramMap.get('branchId');
      if (id) return id;
      route = route.parent ?? null;
    }
    return null;
  }
  ngOnInit(): void {
    if (this.showEditVIew()) {
      this.inventoryColumns = this.inventoryColumns.filter(column => column.header !== 'actions');
    }
  }

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontró inventario',
    showLoading: this._inventoryResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly selectedInventoryCount = computed(() => this.selectedInventoryIds().length);
  protected readonly isAllVisibleSelected = computed(() => {
    const visibleInventories = this.inventoryData()?.items ?? [];
    if (!visibleInventories.length) {
      return false;
    }

    const selectedIds = this.selectedInventoryIds();
    return visibleInventories.every(item => selectedIds.includes(item.id));
  });

  protected editInventory(event: Inventory): void {
    this._dialog.open(ModalInventoryComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected startInlineEdit(inventory: Inventory): void {
    this._editableValues.update(current => ({
      ...current,
      [inventory.id]: {
        price: inventory.price ?? null,
        stock: inventory.stock ?? null,
        lowStock: inventory.lowStock ?? null,
      },
    }));
    this.editingRowId.set(inventory.id);
  }

  protected saveInlineEdit(): void {
    this._branchService
      .updateBranchProducts(this._findBranchId() ?? '', {
        productId: this.editingRowId() ?? '',
        price: this.getEditableValue(this.editingRowId() ?? '', 'price') ?? 0,
        stock: this.getEditableValue(this.editingRowId() ?? '', 'stock') ?? 0,
        lowStock: this.getEditableValue(this.editingRowId() ?? '', 'lowStock') ?? 0,
      })
      .subscribe(() => {
        this._inventoryResourceService.reloadInventory();
        this._branchMissingProductsResourceService.reload();
        this.editingRowId.set(null);
      });
  }

  protected cancelInlineEdit(): void {
    this.editingRowId.set(null);
  }

  protected isEditingRow(inventoryId: string): boolean {
    return this.editingRowId() === inventoryId;
  }

  protected isInventorySelected(inventoryId: string): boolean {
    return this.selectedInventoryIds().includes(inventoryId);
  }

  protected toggleInventorySelection(inventoryId: string, isChecked: boolean): void {
    const selectedSet = new Set(this.selectedInventoryIds());

    if (isChecked) {
      selectedSet.add(inventoryId);
    } else {
      selectedSet.delete(inventoryId);
    }

    this.selectedInventoryIds.set(Array.from(selectedSet));
  }

  protected toggleVisibleInventories(isChecked: boolean): void {
    const visibleInventories = this.inventoryData()?.items ?? [];
    const selectedSet = new Set(this.selectedInventoryIds());

    visibleInventories.forEach(item => {
      if (isChecked) {
        selectedSet.add(item.id);
      } else {
        selectedSet.delete(item.id);
      }
    });

    this.selectedInventoryIds.set(Array.from(selectedSet));
  }

  protected getEditableValue(inventoryId: string, field: EditableField): number | null {
    return this._editableValues()[inventoryId]?.[field] ?? null;
  }

  protected updateEditableValue(inventoryId: string, field: EditableField, rawValue: string): void {
    const parsedValue = rawValue.trim() === '' ? null : Number(rawValue);

    this._editableValues.update(current => {
      const existing = current[inventoryId] ?? { price: null, stock: null, lowStock: null };

      return {
        ...current,
        [inventoryId]: {
          ...existing,
          [field]: Number.isFinite(parsedValue) ? parsedValue : null,
        },
      };
    });
  }

  protected deleteInventory(inventory: Inventory): void {
    this._confirmModalService
      .open({
        title: 'Eliminar inventario',
        message: `¿Estás seguro de eliminar el inventario "${inventory.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._branchService
            .removeProductsByIds(this._findBranchId() ?? '', [inventory.id.toString()])
            .pipe(
              tap(() =>
                this.selectedInventoryIds.update(ids =>
                  ids.filter(id => id !== inventory.id.toString())
                )
              ),
              tap(() => this._inventoryResourceService.reloadInventory()),
              tap(() => this._branchMissingProductsResourceService.reload()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected deleteSelectedInventories(): void {
    const branchId = this._findBranchId();
    const selectedIds = this.selectedInventoryIds();

    if (!branchId || !selectedIds.length) {
      return;
    }

    this._confirmModalService
      .open({
        title: 'Eliminar productos seleccionados',
        message: `¿Estás seguro de eliminar ${selectedIds.length} producto(s) seleccionados?`,
      })
      .subscribe(result => {
        if (result !== 'confirm') {
          return;
        }

        this.isDeletingSelected.set(true);

        this._branchService
          .removeProductsByIds(branchId, selectedIds)
          .pipe(
            tap(() => this.selectedInventoryIds.set([])),
            tap(() => this._inventoryResourceService.reloadInventory()),
            tap(() => this._branchMissingProductsResourceService.reload()),
            tap(() => this._dialog.closeAll()),
            catchError(() => {
              this._toastrService.error(
                'No se pudieron eliminar los productos seleccionados.',
                'Error'
              );
              return of(null);
            }),
            finalize(() => this.isDeletingSelected.set(false))
          )
          .subscribe();
      });
  }

  protected changePage(page: number): void {
    this._inventoryResourceService.filterInventoryParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._inventoryResourceService.filterInventoryParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
