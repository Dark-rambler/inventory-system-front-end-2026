import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MovementResourceService } from '../../services/movement-resource.service';

@Component({
  selector: 'app-movements-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './movements-filters.component.html',
})
export class MovementsFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _movementResourceService = inject(MovementResourceService);

  protected readonly filtersForm = this._fb.group({
    movementType: [''],
    productName: [''],
    branchName: [''],
    startDate: [''],
    endDate: [''],
  });

  constructor() {
    const initialFilters = this._movementResourceService.filterMovementParameters();
    this.filtersForm.patchValue(
      {
        movementType: initialFilters.movementType ?? '',
        productName: initialFilters.productName ?? '',
        branchName: initialFilters.branchName ?? '',
        startDate: initialFilters.startDate ?? '',
        endDate: initialFilters.endDate ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          movementType: (value.movementType ?? '').trim(),
          productName: (value.productName ?? '').trim(),
          branchName: (value.branchName ?? '').trim(),
          startDate: (value.startDate ?? '').trim(),
          endDate: (value.endDate ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.movementType === curr.movementType &&
            prev.productName === curr.productName &&
            prev.branchName === curr.branchName &&
            prev.startDate === curr.startDate &&
            prev.endDate === curr.endDate
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._movementResourceService.filterMovementParameters.update(params => ({
          ...params,
          page: 1,
          movementType: filters.movementType || undefined,
          productName: filters.productName || undefined,
          branchName: filters.branchName || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        }));
      });
  }
}
