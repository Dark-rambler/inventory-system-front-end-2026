import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { SalesResourceService } from '../../services/sales-resource.service';

@Component({
  selector: 'app-sales-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './sales-filters.component.html',
})
export class SalesFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _salesResourceService = inject(SalesResourceService);

  protected readonly filtersForm = this._fb.group({
    folio: [''],
    customerName: [''],
    branchName: [''],
    status: [''],
    startDate: [''],
    endDate: [''],
  });

  constructor() {
    const initialFilters = this._salesResourceService.filterSalesParameters();
    this.filtersForm.patchValue(
      {
        folio: initialFilters.folio ?? '',
        customerName: initialFilters.customerName ?? '',
        branchName: initialFilters.branchName ?? '',
        status: initialFilters.status ?? '',
        startDate: initialFilters.startDate ?? '',
        endDate: initialFilters.endDate ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(400),
        map(value => ({
          folio: (value.folio ?? '').trim(),
          customerName: (value.customerName ?? '').trim(),
          branchName: (value.branchName ?? '').trim(),
          status: (value.status ?? '').trim(),
          startDate: (value.startDate ?? '').trim(),
          endDate: (value.endDate ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.folio === curr.folio &&
            prev.customerName === curr.customerName &&
            prev.branchName === curr.branchName &&
            prev.status === curr.status &&
            prev.startDate === curr.startDate &&
            prev.endDate === curr.endDate
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._salesResourceService.filterSalesParameters.update(params => ({
          ...params,
          page: 1,
          folio: filters.folio || undefined,
          customerName: filters.customerName || undefined,
          branchName: filters.branchName || undefined,
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
        }));
      });
  }
}
