import { Pipe, PipeTransform } from '@angular/core';
import { TableCellContext } from '../table.types';

@Pipe({
  name: 'tableCellContext',
  standalone: true,
  pure: true,
})
export class TableCellContextPipe implements PipeTransform {
  transform<T>(row: T, index: number, dataLength: number): TableCellContext<T> {
    return {
      $implicit: row,
      index,
      first: index === 0,
      last: index === dataLength - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
    };
  }
}
