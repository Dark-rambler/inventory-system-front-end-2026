import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccordionComponent } from '@shared/components/accordion';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { UserResourceService } from '../../services/user-resource.service';

@Component({
  selector: 'app-users-filters',
  standalone: true,
  imports: [AccordionComponent, ReactiveFormsModule, FormInputComponent],
  templateUrl: './users-filters.component.html',
})
export class UsersFiltersComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _userResourceService = inject(UserResourceService);

  protected readonly filtersForm = this._fb.group({
    name: [''],
    userName: [''],
    email: [''],
    role: [''],
  });

  constructor() {
    const initialFilters = this._userResourceService.filterUserParameters();
    this.filtersForm.patchValue(
      {
        name: initialFilters.name ?? '',
        userName: initialFilters.userName ?? '',
        email: initialFilters.email ?? '',
        role: initialFilters.role ?? '',
      },
      { emitEvent: false }
    );

    this.filtersForm.valueChanges
      .pipe(
        debounceTime(350),
        map(value => ({
          name: (value.name ?? '').trim(),
          userName: (value.userName ?? '').trim(),
          email: (value.email ?? '').trim(),
          role: (value.role ?? '').trim(),
        })),
        distinctUntilChanged(
          (prev, curr) =>
            prev.name === curr.name &&
            prev.userName === curr.userName &&
            prev.email === curr.email &&
            prev.role === curr.role
        ),
        takeUntilDestroyed()
      )
      .subscribe(filters => {
        this._userResourceService.filterUserParameters.update(params => ({
          ...params,
          page: 1,
          name: filters.name || undefined,
          userName: filters.userName || undefined,
          email: filters.email || undefined,
          role: filters.role || undefined,
        }));
      });
  }
}
