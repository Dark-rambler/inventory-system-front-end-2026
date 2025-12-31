import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { TableCellTemplateDirective } from './directives/table-cell-template.directive';
import { TableColumnDirective } from './directives/table-column.directive';
import { TableValuePipe } from './pipes/table-value.pipe';
import { TableActionEvent, TableCellContext, TableColumn, TableConfig } from './table.types';

/**
 * Componente de tabla genérica y reutilizable
 *
 * @example
 * <app-table
 *   [data]="products"
 *   [columns]="columns"
 *   [config]="tableConfig"
 *   (actionClick)="handleAction($event)">
 *
 *   <ng-template appTableColumn="name" let-row>
 *     <span class="font-bold">{{ row.name }}</span>
 *   </ng-template>
 * </app-table>
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, CdkTableModule, TableValuePipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements AfterContentInit, OnChanges {
  /** Datos a mostrar en la tabla */
  @Input() data: T[] = [];

  /** Definición de columnas */
  @Input() columns: TableColumn<T>[] = [];

  /** Configuración de la tabla */
  @Input() config: TableConfig = {
    emptyMessage: 'No hay datos disponibles',
    showLoading: false,
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  };

  /** Evento emitido cuando se ejecuta una acción sobre una fila */
  @Output() actionClick = new EventEmitter<TableActionEvent<T>>();

  /** Templates personalizados inyectados por ng-content */
  @ContentChildren(TableColumnDirective) columnTemplates!: QueryList<TableColumnDirective<T>>;
  @ContentChildren(TableCellTemplateDirective) cellTemplates!: QueryList<
    TableCellTemplateDirective<T>
  >;

  /** Columnas a mostrar (keys) */
  displayedColumns: string[] = [];

  /** Mapa de templates personalizados por columna */
  private customTemplates = new Map<string, TemplateRef<TableCellContext<T>>>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      this.updateDisplayedColumns();
    }
  }

  ngAfterContentInit(): void {
    this.mapCustomTemplates();
    this.updateDisplayedColumns();
  }

  /**
   * Actualiza la lista de columnas a mostrar
   */
  private updateDisplayedColumns(): void {
    this.displayedColumns = this.columns.map(col => col.key);
  }

  /**
   * Mapea los templates personalizados con sus columnas
   */
  private mapCustomTemplates(): void {
    this.customTemplates.clear();

    // Templates con directiva appTableColumn
    this.columnTemplates?.forEach(directive => {
      this.customTemplates.set(directive.columnKey, directive.template);
    });

    // Templates con directiva appTableCellTemplate
    this.cellTemplates?.forEach(directive => {
      this.customTemplates.set(directive.cellKey, directive.template);
    });

    // Templates definidos directamente en las columnas
    this.columns.forEach(column => {
      if (column.cellTemplate) {
        this.customTemplates.set(column.key, column.cellTemplate);
      }
    });
  }

  /**
   * Obtiene el template personalizado para una columna
   */
  getCustomTemplate(columnKey: string): TemplateRef<TableCellContext<T>> | undefined {
    return this.customTemplates.get(columnKey);
  }

  /**
   * Obtiene el valor de una celda
   */
  getCellValue(row: T, column: TableColumn<T>): unknown {
    if (column.valueGetter) {
      return column.valueGetter(row);
    }
    return (row as Record<string, unknown>)[column.key];
  }

  /**
   * Crea el contexto para un template de celda
   */
  createCellContext(row: T, index: number): TableCellContext<T> {
    return {
      $implicit: row,
      index,
      first: index === 0,
      last: index === this.data.length - 1,
      even: index % 2 === 0,
      odd: index % 2 !== 0,
    };
  }

  /**
   * Emite un evento de acción
   */
  emitAction(action: string, row: T, index: number): void {
    this.actionClick.emit({ action, row, index });
  }

  /**
   * Genera un array para el skeleton loader
   */
  getSkeletonArray(): number[] {
    return Array(this.config.skeletonRows || 5).fill(0);
  }

  /**
   * Verifica si la tabla está vacía
   */
  get isEmpty(): boolean {
    return !this.data || this.data.length === 0;
  }

  /**
   * Verifica si se debe mostrar el estado de carga
   */
  get isLoading(): boolean {
    return this.config.showLoading || false;
  }
}
