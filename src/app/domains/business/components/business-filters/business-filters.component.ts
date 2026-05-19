import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { BusinessResourceService } from '../../services/business-resource.service';

@Component({
  selector: 'app-business-filters',
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './business-filters.component.html',
})
export class BusinessFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _businessResourceService = inject(BusinessResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
  });

  constructor() {
    const initialFilters = this._businessResourceService.filterBusinessParameters();
    this.filtersForm.patchValue({ name: initialFilters.name ?? '' }, { emitEvent: false });

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({ name: (value.name ?? '').trim() })),
        distinctUntilChanged((prev, curr) => prev.name === curr.name),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._businessResourceService.filterBusinessParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
        }));
      });
  }
}
