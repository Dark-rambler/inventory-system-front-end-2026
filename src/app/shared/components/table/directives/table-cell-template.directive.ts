import { Directive, Input, TemplateRef, inject } from '@angular/core';
import { TableCellContext } from '../table.types';

/**
 * Directiva alternativa para definir templates de celdas
 * Útil cuando se necesita más control sobre el contexto
 *
 * @example
 * <ng-template appTableCellTemplate="actions" let-item let-i="index">
 *   <button (click)="edit(item)">Editar</button>
 * </ng-template>
 */
@Directive({
  selector: '[appTableCellTemplate]',
  standalone: true,
})
export class TableCellTemplateDirective<T> {
  /** Identificador de la celda */
  @Input('appTableCellTemplate') cellKey!: string;

  template = inject<TemplateRef<TableCellContext<T>>>(TemplateRef);
}
