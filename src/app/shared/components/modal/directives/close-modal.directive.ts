import { Dialog } from '@angular/cdk/dialog';
import { Directive, inject } from '@angular/core';

@Directive({
  selector: '[appCloseModal]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class CloseModalDirective {
  private readonly _dialog = inject(Dialog);
  onClick(): void {
    this._dialog.closeAll();
  }
}
