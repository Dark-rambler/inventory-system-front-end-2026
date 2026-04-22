import { Component, inject, ViewContainerRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MovementFormComponent } from '../../modal-movement/components/movement-form.component';
import { MovementResourceService } from '@app/domains/movements/services/movement-resource.service';
import { MovementsTableComponent } from './components/movements-table/movements-table.component';
import { BranchMovementResourceService } from './services/branch-movement.resource.service';
import { ButtonComponent } from '@app/shared/components/button';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-create-branch-movement',
  standalone: true,
  imports: [MovementsTableComponent, ButtonComponent],
  providers: [MovementResourceService, BranchMovementResourceService],
  templateUrl: './create-branch-movement.component.html',
})
export class CreateBranchMovementComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  protected readonly branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );
  protected handleNewMovement(): void {
    this._dialog.open(MovementFormComponent, {
      viewContainerRef: this._viewContainerRef,
      data: { branchId: this.branchId() ?? undefined },
    });
  }
}
