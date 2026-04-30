import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tabButtonClass',
  standalone: true,
  pure: true,
})
export class TabButtonClassPipe implements PipeTransform {
  private readonly _baseClasses =
    'inline-flex min-w-max items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1';

  private readonly _activeClasses = 'border-primary text-primary';

  private readonly _inactiveClasses =
    'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700';

  private readonly _disabledClasses = 'cursor-not-allowed border-transparent text-slate-300';

  transform(isActive: boolean, isDisabled: boolean): string {
    if (isDisabled) {
      return `${this._baseClasses} ${this._disabledClasses}`;
    }

    return `${this._baseClasses} ${isActive ? this._activeClasses : this._inactiveClasses}`;
  }
}
