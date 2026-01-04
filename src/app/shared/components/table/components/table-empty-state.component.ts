import { Component, input } from '@angular/core';

@Component({
  selector: 'app-table-empty-state',
  standalone: true,
  templateUrl: './table-empty-state.component.html',
})
export class TableEmptyStateComponent {
  message = input.required<string>();
}
