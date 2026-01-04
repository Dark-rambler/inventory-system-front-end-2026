import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { TableEmptyStateComponent } from './components/table-empty-state.component';
import { TableSkeletonComponent } from './components/table-skeleton.component';
import { TableCellTemplateDirective } from './directives/table-cell-template.directive';
import { TableColumnDirective } from './directives/table-column.directive';
import {
  createDisplayedColumnsSignal,
  createIsEmptySignal,
  createIsLoadingSignal,
  createSkeletonArraySignal,
} from './helpers/table.helpers';
import { ColumnWidthPipe } from './pipes/column-width.pipe';
import { HasCustomTemplatePipe } from './pipes/has-custom-template.pipe';
import { TableCellContextPipe } from './pipes/table-cell-context.pipe';
import { TableRowClassesPipe } from './pipes/table-row-classes.pipe';
import { TableValuePipe } from './pipes/table-value.pipe';
import { TableActionEvent, TableCellContext, TableColumn, TableConfig } from './table.types';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    CdkTableModule,
    TableValuePipe,
    TableRowClassesPipe,
    TableCellContextPipe,
    HasCustomTemplatePipe,
    ColumnWidthPipe,
    TableEmptyStateComponent,
    TableSkeletonComponent,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements AfterContentInit {
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly config = input<Partial<TableConfig>>({});

  protected readonly normalizedConfig = computed<TableConfig>(() => {
    const cfg = this.config();
    return {
      emptyMessage: cfg.emptyMessage ?? 'No hay datos disponibles',
      showLoading: cfg.showLoading ?? false,
      skeletonRows: cfg.skeletonRows ?? 5,
      enableHover: cfg.enableHover ?? true,
      enableStriped: cfg.enableStriped ?? true,
    };
  });

  readonly actionClick = output<TableActionEvent<T>>();

  @ContentChildren(TableColumnDirective) columnTemplates!: QueryList<TableColumnDirective<T>>;
  @ContentChildren(TableCellTemplateDirective) cellTemplates!: QueryList<
    TableCellTemplateDirective<T>
  >;
  protected readonly displayedColumns = createDisplayedColumnsSignal(this.columns);
  protected readonly skeletonArray = createSkeletonArraySignal(this.normalizedConfig);
  protected readonly isEmpty = createIsEmptySignal(this.data);
  protected readonly isLoading = createIsLoadingSignal(this.normalizedConfig);
  protected readonly customTemplates = signal<Map<string, TemplateRef<TableCellContext<T>>>>(
    new Map()
  );
  ngAfterContentInit(): void {
    this.mapCustomTemplates();
  }

  private mapCustomTemplates(): void {
    const templatesMap = new Map<string, TemplateRef<TableCellContext<T>>>();

    this.columnTemplates?.forEach(directive => {
      templatesMap.set(directive.columnKey, directive.template);
    });

    this.cellTemplates?.forEach(directive => {
      templatesMap.set(directive.cellKey, directive.template);
    });

    this.columns().forEach(column => {
      if (column.cellTemplate) {
        templatesMap.set(column.key, column.cellTemplate);
      }
    });

    this.customTemplates.set(templatesMap);
  }
}
