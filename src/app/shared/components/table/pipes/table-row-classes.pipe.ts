import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableRowClasses',
  standalone: true,
  pure: true,
})
export class TableRowClassesPipe implements PipeTransform {
  transform(index: number, enableHover: boolean, enableStriped: boolean): string {
    const classes: string[] = ['app-table-row'];

    if (enableHover) {
      classes.push('app-table-row-hover');
    }

    if (enableStriped && index % 2 !== 0) {
      classes.push('app-table-row-striped');
    }

    return classes.join(' ');
  }
}
