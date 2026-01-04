import { Directive, Input, TemplateRef, inject } from '@angular/core';
import { TableCellContext } from '../table.types';

/**
 * Directiva para definir columnas personalizadas con templates
 *
 * @example
 * <ng-template appTableColumn="name" let-row>
 *   <span class="font-bold">{{ row.name }}</span>
 * </ng-template>
 */
@Directive({
  selector: '[appTableColumn]',
  standalone: true,
})
export class TableColumnDirective<T> {
  /** Identificador de la columna a la que aplica el template */
  @Input('appTableColumn') columnKey!: string;

  template = inject<TemplateRef<TableCellContext<T>>>(TemplateRef);
}
