import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BranchResourceService } from '../../services/branch-resource.service';

@Component({
  selector: 'app-branches-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './branches-filters.component.html',
})
export class BranchesFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _branchResourceService = inject(BranchResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
    location: [''],
  });

  constructor() {
    const initialFilters = this._branchResourceService.filterBranchParameters();
    this.filtersForm.patchValue(
      {
        name: initialFilters.name ?? '',
        location: initialFilters.location ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          name: (value.name ?? '').trim(),
          location: (value.location ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) => prev.name === curr.name && prev.location === curr.location
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._branchResourceService.filterBranchParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
          location: filters.location || undefined,
        }));
      });
  }
}
