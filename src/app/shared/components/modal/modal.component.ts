import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CloseModalDirective } from './directives/close-modal.directive';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, CloseModalDirective],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly width = input<string>('w-128');
  readonly showCloseButton = input<boolean>(true);
  readonly modalClose = output<void>();
  protected onClose(): void {
    this.modalClose.emit();
  }
}
