import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovementResourceService } from '@app/domains/movements/services/movement-resource.service';
import { TableComponent } from '@app/shared/components/table';
import { BranchMovementResourceService } from '../../services/branch-movement.resource.service';
import { MOVEMENT_COLUMNS } from '@app/domains/movements/constants/movement-columns.constant';

@Component({
  selector: 'app-movements-table',
  standalone: true,
  imports: [TableComponent],
  providers: [MovementResourceService],
  templateUrl: './movements-table.component.html',
})
export class MovementsTableComponent {
  private readonly _route = inject(ActivatedRoute);
  protected readonly _branchMovementResourceService = inject(BranchMovementResourceService);
  protected readonly movementData = this._branchMovementResourceService.movementData;
  protected readonly isLoading = this._branchMovementResourceService.isLoading;
  protected readonly isEmpty = this._branchMovementResourceService.isEmpty;
  protected readonly columns = MOVEMENT_COLUMNS;
}
