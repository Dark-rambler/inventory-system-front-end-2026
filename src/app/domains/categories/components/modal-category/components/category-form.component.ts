import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { CATEGORY_FORM_CONTROL } from '../../../constants/category-form.constant';
import { SendCategoryDirective } from '../directives/click-send-category.directive';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendCategoryDirective],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected categoryForm = this.formBuilder.group(CATEGORY_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.categoryForm.patchValue(this.data);
    }
  }
}
