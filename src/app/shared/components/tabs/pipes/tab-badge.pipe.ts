import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tabBadge',
  standalone: true,
  pure: true,
})
export class TabBadgePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return '0';
      }

      const normalizedValue = Math.max(0, Math.trunc(value));
      return normalizedValue > 99 ? '99+' : String(normalizedValue);
    }

    return value.trim();
  }
}
