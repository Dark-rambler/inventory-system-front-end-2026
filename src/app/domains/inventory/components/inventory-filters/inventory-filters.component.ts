import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { InventoryResourceService } from '../../services/inventory-resource.service';

@Component({
  selector: 'app-inventory-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './inventory-filters.component.html',
})
export class InventoryFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _inventoryResourceService = inject(InventoryResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
    code: [''],
    category: [''],
  });

  constructor() {
    const initialFilters = this._inventoryResourceService.filterInventoryParameters();
    this.filtersForm.patchValue(
      {
        name: initialFilters.name ?? '',
        code: initialFilters.code ?? '',
        category: initialFilters.category ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          name: (value.name ?? '').trim(),
          code: (value.code ?? '').trim(),
          category: (value.category ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.name === curr.name && prev.code === curr.code && prev.category === curr.category
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._inventoryResourceService.filterInventoryParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
          code: filters.code || undefined,
          category: filters.category || undefined,
        }));
      });
  }
}
