import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'columnWidth',
  standalone: true,
  pure: true,
})
export class ColumnWidthPipe implements PipeTransform {
  transform(width: string | undefined): string | null {
    return width || null;
  }
}
