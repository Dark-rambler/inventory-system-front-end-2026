import { Directive, ElementRef, inject, input, output } from '@angular/core';

@Directive({
  selector: '[appConfirmAction]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class ConfirmActionDirective<T = unknown> {
  private readonly _elementRef = inject(ElementRef);
  public confirmMessage = input<string>('¿Estás seguro de realizar esta acción?');
  public confirmTitle = input<string>('Confirmar acción');
  public confirmType = input<'native' | 'dialog'>('native');
  public data = input<T>();
  public confirmed = output<T | undefined>();
  public cancelled = output<void>();
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const message = this.confirmMessage();
    const shouldConfirm = this._showConfirmation(message);

    if (shouldConfirm) {
      this.confirmed.emit(this.data());
    } else {
      this.cancelled.emit();
    }
  }

  private _showConfirmation(message: string): boolean {
    const type = this.confirmType();

    if (type === 'native') {
      return confirm(message);
    }

    // TODO: Implementar modal personalizado cuando esté disponible
    // if (type === 'dialog') {
    //   return this._dialogService.confirm({
    //     title: this.confirmTitle(),
    //     message: message
    //   });
    // }

    return confirm(message);
  }
}
