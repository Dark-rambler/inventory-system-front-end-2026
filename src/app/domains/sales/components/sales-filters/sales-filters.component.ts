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
    status: [''],
    fromDate: [''],
    toDate: [''],
  });

  constructor() {
    const initialFilters = this._salesResourceService.filterSalesParameters();
    this.filtersForm.patchValue(
      {
        folio: initialFilters.folio ?? '',
        customerName: initialFilters.customerName ?? '',
        status: initialFilters.status ?? '',
        fromDate: initialFilters.fromDate ?? '',
        toDate: initialFilters.toDate ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(400),
        map(value => ({
          folio: (value.folio ?? '').trim(),
          customerName: (value.customerName ?? '').trim(),
          status: (value.status ?? '').trim(),
          fromDate: (value.fromDate ?? '').trim(),
          toDate: (value.toDate ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.folio === curr.folio &&
            prev.customerName === curr.customerName &&
            prev.status === curr.status &&
            prev.fromDate === curr.fromDate &&
            prev.toDate === curr.toDate
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._salesResourceService.filterSalesParameters.update(params => ({
          ...params,
          page: 1,
          folio: filters.folio || undefined,
          customerName: filters.customerName || undefined,
          status: filters.status || undefined,
          fromDate: filters.fromDate || undefined,
          toDate: filters.toDate || undefined,
        }));
      });
  }
}
