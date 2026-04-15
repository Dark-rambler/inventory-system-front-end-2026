import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { WarehouseResourceService } from '../../services/warehouse-resource.service';

@Component({
  selector: 'app-warehouses-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './warehouses-filters.component.html',
})
export class WarehousesFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _warehouseResourceService = inject(WarehouseResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
    location: [''],
  });

  constructor() {
    const initialFilters = this._warehouseResourceService.filterWarehouseParameters();
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
        this._warehouseResourceService.filterWarehouseParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
          location: filters.location || undefined,
        }));
      });
  }
}
