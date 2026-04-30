import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormDropdownComponent } from '@shared/form-dropdown/form-dropdown.component';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { PURCHASE_STATUS_OPTIONS } from '../../constants/purchase-options.constant';
import { PurchaseResourceService } from '../../services/purchase-resource.service';

@Component({
  selector: 'app-purchases-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent, FormDropdownComponent],
  templateUrl: './purchases-filters.component.html',
})
export class PurchasesFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _purchaseResourceService = inject(PurchaseResourceService);

  protected readonly statusOptions = PURCHASE_STATUS_OPTIONS;

  protected readonly filtersForm = this._fb.group({
    folio: [''],
    supplierName: [''],
    status: [''],
  });

  constructor() {
    const initialFilters = this._purchaseResourceService.filterPurchaseParameters();
    this.filtersForm.patchValue(
      {
        folio: initialFilters.folio ?? '',
        supplierName: initialFilters.supplierName ?? '',
        status: initialFilters.status ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          folio: (value.folio ?? '').trim(),
          supplierName: (value.supplierName ?? '').trim(),
          status: (value.status ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.folio === curr.folio &&
            prev.supplierName === curr.supplierName &&
            prev.status === curr.status
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._purchaseResourceService.filterPurchaseParameters.update(params => ({
          ...params,
          page: 1,
          folio: filters.folio || undefined,
          supplierName: filters.supplierName || undefined,
          status: filters.status || undefined,
        }));
      });
  }
}
