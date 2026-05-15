import { Dialog } from '@angular/cdk/dialog';
import { Component, effect, inject, ViewContainerRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { MOVEMENT_COLUMNS_BRANCH } from '@app/domains/movements/constants/movement-columns.constant';
import { MovementResourceService } from '@app/domains/movements/services/movement-resource.service';
import { map } from 'rxjs';
import { MovementFormComponent } from '../../modal-movement/components/movement-form.component';
import { MovementsTableComponent } from './components/movements-table/movements-table.component';
import { BranchMovementResourceService } from './services/branch-movement.resource.service';

@Component({
  selector: 'app-create-branch-movement',
  standalone: true,
  imports: [MovementsTableComponent],
  providers: [MovementResourceService, BranchMovementResourceService],
  templateUrl: './create-branch-movement.component.html',
})
export class CreateBranchMovementComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _branchMovementResourceService = inject(BranchMovementResourceService);
  protected readonly branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );
  protected readonly MOVEMENT_COLUMNS = MOVEMENT_COLUMNS_BRANCH;
  protected readonly movementData = this._branchMovementResourceService.movementData;
  protected readonly isLoading = this._branchMovementResourceService.isLoading;
  protected readonly isEmpty = this._branchMovementResourceService.isEmpty;

  constructor() {
    effect(() => {
      this._branchMovementResourceService.setBranchId(this.branchId());
    });
  }

  protected handleNewMovement(): void {
    this._dialog.open(MovementFormComponent, {
      viewContainerRef: this._viewContainerRef,
      data: { branchId: this.branchId() ?? undefined },
    });
  }
}
