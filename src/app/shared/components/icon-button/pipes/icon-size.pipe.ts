import { Pipe, PipeTransform } from '@angular/core';
import { IconButtonSize } from '../icon-button.component';

@Pipe({
  name: 'iconSize',
  standalone: true,
  pure: true,
})
export class IconSizePipe implements PipeTransform {
  transform(size: IconButtonSize): string {
    const iconSizes: Record<IconButtonSize, string> = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return iconSizes[size];
  }
}
