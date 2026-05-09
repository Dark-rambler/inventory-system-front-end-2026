import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { SupplierResourceService } from '../../services/supplier-resource.service';

@Component({
  selector: 'app-suppliers-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './suppliers-filters.component.html',
})
export class SuppliersFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _supplierResourceService = inject(SupplierResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
    email: [''],
    phone: [''],
  });

  constructor() {
    const initialFilters = this._supplierResourceService.filterSupplierParameters();
    this.filtersForm.patchValue(
      {
        name: initialFilters.name ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          name: (value.name ?? '').trim(),
          email: (value.email ?? '').trim(),
          phone: (value.phone ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.name === curr.name && prev.email === curr.email && prev.phone === curr.phone
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._supplierResourceService.filterSupplierParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
          email: filters.email || undefined,
          phone: filters.phone || undefined,
        }));
      });
  }
}
