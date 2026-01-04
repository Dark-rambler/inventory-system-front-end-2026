import { Directive } from '@angular/core';

@Directive({
  selector: '[appEditItem]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class EditItemDirective {
  onClick(): void {
    // Lógica para manejar el clic y editar el elemento
  }
}
