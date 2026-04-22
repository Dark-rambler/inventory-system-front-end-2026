import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MovementFormComponent } from './components/modal-movement/components/movement-form.component';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';
import { MovementResourceService } from './services/movement-resource.service';

@Component({
  selector: 'app-create-branch-movement',
  standalone: true,
  imports: [MovementsHeaderComponent, MovementFormComponent],
  providers: [MovementResourceService],
  templateUrl: './create-branch-movement.component.html',
})
export class CreateBranchMovementComponent {
  private readonly _route = inject(ActivatedRoute);

  protected readonly branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );
}
