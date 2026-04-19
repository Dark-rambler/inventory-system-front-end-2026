import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
      state('expanded', style({ opacity: 1, height: '*', overflow: 'visible' })),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ]),
  ],
})
export class AccordionComponent {
  readonly title = input<string>('Filtros');
  readonly isExpanded = signal<boolean>(false);

  toggleExpanded(): void {
    this.isExpanded.update(state => !state);
  }
}
