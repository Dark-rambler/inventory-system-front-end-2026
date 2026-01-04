import { Directive } from '@angular/core';

@Directive({
  selector: '[appViewDetails]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class ViewDetailsDirective {
  onClick(): void {
    // Lógica para manejar el clic y mostrar los detalles
  }
}
