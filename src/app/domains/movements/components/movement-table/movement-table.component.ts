import { Component, computed, inject } from '@angular/core';
import {
  PaginatorComponent,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import { MOVEMENT_COLUMNS } from '../../constants/movement-columns.constant';
import { MovementResourceService } from '../../services/movement-resource.service';

@Component({
  selector: 'app-movement-table',
  standalone: true,
  imports: [TableComponent, PaginatorComponent],
  templateUrl: './movement-table.component.html',
})
export class MovementTableComponent {
  private readonly _movementResourceService = inject(MovementResourceService);

  public movementData = this._movementResourceService.movementData;
  public currentPage = this._movementResourceService.filterMovementParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron movimientos',
    showLoading: this._movementResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly movementColumns = MOVEMENT_COLUMNS;

  protected changePage(page: number): void {
    this._movementResourceService.filterMovementParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._movementResourceService.filterMovementParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
