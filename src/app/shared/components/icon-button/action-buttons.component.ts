import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center gap-1">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class ActionButtonsComponent {}
