import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormErrorComponent } from '../components/form-error';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './form-input.component.html',
})
export class FormInputComponent {
  public parentForm = input.required<FormGroup>();
  public controlName = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<string>('text');
  readonly placeholder = input<string>('Ingrese un valor');
  readonly name = input.required<string>();
  readonly textArea = input<boolean>(false);

  protected readonly hasError = computed(() => {
    const ctrl = this.control();
    return ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  });

  public control = computed(() => {
    const form = this.parentForm();
    const controlName = this.controlName();
    return form?.get(controlName) as FormControl;
  });
}
