import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
})
export class FormErrorComponent {
  readonly control = input<AbstractControl | null>();
  readonly fieldName = input<string>('');
  readonly customMessages = input<Record<string, string>>({});

  get errorMessage(): string | null {
    const ctrl = this.control();
    if (!ctrl || !ctrl.errors || !this.isFieldInvalid) {
      return null;
    }

    const errors = ctrl.errors;
    const errorKeys = ['required', 'email', 'minlength', 'maxlength', 'pattern', 'min', 'max'];
    const firstErrorKey = errorKeys.find(key => errors[key]) || Object.keys(errors)[0];

    switch (firstErrorKey) {
      case 'required':
        return this.customMessages()['required'] || `${this.fieldName()} es requerido`;

      case 'email':
        return this.customMessages()['email'] || 'Ingrese un email válido';

      case 'minlength': {
        const minRequiredLength = errors['minlength'].requiredLength;
        return (
          this.customMessages()['minlength'] ||
          `${this.fieldName()} debe tener al menos ${minRequiredLength} caracteres`
        );
      }

      case 'maxlength': {
        const maxRequiredLength = errors['maxlength'].requiredLength;
        return (
          this.customMessages()['maxlength'] ||
          `${this.fieldName()} no puede exceder ${maxRequiredLength} caracteres`
        );
      }

      case 'pattern':
        return this.customMessages()['pattern'] || `El formato de ${this.fieldName()} es inválido`;

      case 'min': {
        const minValue = errors['min'].min;
        return this.customMessages()['min'] || `${this.fieldName()} debe ser al menos ${minValue}`;
      }

      case 'max': {
        const maxValue = errors['max'].max;
        return this.customMessages()['max'] || `${this.fieldName()} no puede exceder ${maxValue}`;
      }

      case 'duplicatePrefix':
        return this.customMessages()['duplicatePrefix'] || 'Este prefijo ya está en uso';

      default:
        return this.customMessages()[firstErrorKey] || `${this.fieldName()} es inválido`;
    }
  }

  get isFieldInvalid(): boolean {
    const ctrl = this.control();
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}
