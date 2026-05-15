import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { CustomerResourceService } from '../../services/customer-resource.service';

@Component({
  selector: 'app-customers-filters',
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './customers-filters.component.html',
})
export class CustomersFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _customerResourceService = inject(CustomerResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
  });

  constructor() {
    const initialFilters = this._customerResourceService.filterCustomerParameters();
    this.filtersForm.patchValue({ name: initialFilters.name ?? '' }, { emitEvent: false });

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({ name: (value.name ?? '').trim() })),
        distinctUntilChanged((prev, curr) => prev.name === curr.name),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._customerResourceService.filterCustomerParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
        }));
      });
  }
}
