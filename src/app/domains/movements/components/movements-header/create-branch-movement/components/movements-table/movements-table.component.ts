import { Component, input } from '@angular/core';
import { MOVEMENT_COLUMNS } from '@app/domains/movements/constants/movement-columns.constant';
import { Movement } from '@app/domains/movements/interfaces/movement.interface';
import { TableColumn, TableComponent } from '@app/shared/components/table';
import { PaginatorInterface } from '@app/shared/interfaces/paginator.interface';

@Component({
  selector: 'app-movements-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './movements-table.component.html',
})
export class MovementsTableComponent {
  public columns = input<TableColumn<Movement>[]>(MOVEMENT_COLUMNS);
  public movementData = input<PaginatorInterface<Movement> | null>(null);
  public isLoading = input<boolean>(false);
  public isEmpty = input<boolean>(false);
}
