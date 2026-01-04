import { Pipe, PipeTransform, TemplateRef } from '@angular/core';
import { TableCellContext } from '../table.types';

@Pipe({
  name: 'hasCustomTemplate',
  standalone: true,
  pure: true,
})
export class HasCustomTemplatePipe implements PipeTransform {
  transform<T>(
    columnKey: string,
    templatesMap: Map<string, TemplateRef<TableCellContext<T>>>
  ): TemplateRef<TableCellContext<T>> | undefined {
    return templatesMap.get(columnKey);
  }
}
