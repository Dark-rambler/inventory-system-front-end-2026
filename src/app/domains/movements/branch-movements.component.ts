import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MovementTableComponent } from './components/movement-table';
import { MovementsFiltersComponent } from './components/movements-filters/movements-filters.component';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';
import { MovementResourceService } from './services/movement-resource.service';

@Component({
  selector: 'app-branch-movements',
  standalone: true,
  imports: [MovementsHeaderComponent, MovementsFiltersComponent, MovementTableComponent],
  providers: [MovementResourceService],
  templateUrl: './branch-movements.component.html',
})
export class BranchMovementsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _movementResourceService = inject(MovementResourceService);

  private readonly _branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );

  protected readonly branchId = this._branchId;

  constructor() {
    effect(() => {
      const branchId = this._branchId();
      this._movementResourceService.setBranchId(branchId);
    });
  }
}
