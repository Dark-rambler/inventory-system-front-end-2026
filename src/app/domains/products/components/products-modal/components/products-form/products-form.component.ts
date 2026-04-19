import { HttpParams } from '@angular/common/http';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Category } from '@app/shared/interfaces/category.interface';
import { CategoryService } from '@app/shared/services/category.service';
import { FormDropdownComponent } from '@app/shared/form-dropdown/form-dropdown.component';
import { ButtonComponent } from '@app/shared/components/button';
import { FormInputComponent } from '@app/shared/form-input/form-input.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PRODUCT_FORM_CONTROL } from '../../../constants/form-products.constants';
import { SendProductDirective } from '../../directives/click-send-product.directive';

@Component({
  selector: 'app-products-form',
  imports: [
    FormInputComponent,
    FormDropdownComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SendProductDirective,
  ],
  templateUrl: './products-form.component.html',
})
export class ProductsFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly _categoryService = inject(CategoryService);
  private readonly _destroyRef = inject(DestroyRef);

  protected productForm = this.formBuilder.group(PRODUCT_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);
  protected categoryOptions = signal<Category[]>([]);

  ngOnInit(): void {
    this.loadCategories();
    this.loadData();
  }

  private loadCategories(): void {
    const params = new HttpParams().set('page', 1).set('pageSize', 200);

    this._categoryService
      .getAll(params)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(response => {
        this.categoryOptions.set(response.items ?? []);
      });
  }

  private loadData(): void {
    if (this.data) {
      const data = this.data as {
        category?: { id?: number } | number | string;
        categoryId?: number | string;
      } & Record<string, unknown>;

      const resolvedCategory =
        typeof data.category === 'object' && data.category !== null
          ? data.category.id
          : (data.categoryId ?? data.category);

      this.productForm.patchValue({
        ...data,
        categoryId:
          resolvedCategory !== null && resolvedCategory !== undefined
            ? String(resolvedCategory)
            : '',
      });
    }
  }
}
