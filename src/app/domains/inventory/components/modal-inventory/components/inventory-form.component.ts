import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { INVENTORY_FORM_CONTROL } from '../../../constants/inventory-form.constants';
import { SendInventoryDirective } from '../directives/click-send-inventory.directive';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendInventoryDirective],
  templateUrl: './inventory-form.component.html',
})
export class InventoryFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected inventoryForm = this.formBuilder.group(INVENTORY_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.inventoryForm.patchValue(this.data);
    }
  }
}
