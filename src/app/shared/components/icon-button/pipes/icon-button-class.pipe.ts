import { Pipe, PipeTransform } from '@angular/core';
import { IconButtonAction, IconButtonSize } from '../icon-button.component';

@Pipe({
  name: 'iconButtonClass',
  standalone: true,
  pure: true,
})
export class IconButtonClassPipe implements PipeTransform {
  transform(action: IconButtonAction, size: IconButtonSize, disabled: boolean): string {
    const baseClasses =
      'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const actionClasses: Record<IconButtonAction, string> = {
      view: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      edit: 'text-[#288B83] hover:bg-[#288B83]/10 focus:ring-[#288B83]',
      save: 'text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
      delete: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
      download: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
      share: 'text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
      more: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
    };

    const sizeClasses: Record<IconButtonSize, string> = {
      sm: 'w-7 h-7 p-1',
      md: 'w-8 h-8 p-1.5',
      lg: 'w-10 h-10 p-2',
    };

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${baseClasses} ${actionClasses[action]} ${sizeClasses[size]} ${disabledClasses}`;
  }
}
