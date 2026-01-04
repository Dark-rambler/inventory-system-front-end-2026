import { computed, Signal } from '@angular/core';
import { TableColumn, TableConfig } from '../table.types';

export class TableHelpers {
  static extractDisplayedColumns<T>(columns: TableColumn<T>[]): string[] {
    return columns.map(col => col.key);
  }

  static generateSkeletonArray(rows: number): number[] {
    return Array(rows).fill(0);
  }

  static getCellValue<T>(row: T, column: TableColumn<T>): unknown {
    if (column.valueGetter) {
      return column.valueGetter(row);
    }
    return (row as Record<string, unknown>)[column.key];
  }

  static isTableEmpty<T>(data: T[] | null | undefined): boolean {
    return !data || data.length === 0;
  }

  static shouldShowLoading(config: TableConfig): boolean {
    return config.showLoading || false;
  }

  static getSkeletonRows(config: TableConfig): number {
    return config.skeletonRows || 5;
  }

  static createRowClasses(index: number, config: TableConfig): Record<string, boolean> {
    return {
      'app-table-row': true,
      'app-table-row-hover': config.enableHover || false,
      'app-table-row-striped': (config.enableStriped || false) && index % 2 !== 0,
    };
  }
}

export function createDisplayedColumnsSignal<T>(
  columnsSignal: Signal<TableColumn<T>[]>
): Signal<string[]> {
  return computed(() => TableHelpers.extractDisplayedColumns(columnsSignal()));
}

export function createSkeletonArraySignal(configSignal: Signal<TableConfig>): Signal<number[]> {
  return computed(() =>
    TableHelpers.generateSkeletonArray(TableHelpers.getSkeletonRows(configSignal()))
  );
}

export function createIsEmptySignal<T>(dataSignal: Signal<T[]>): Signal<boolean> {
  return computed(() => TableHelpers.isTableEmpty(dataSignal()));
}

export function createIsLoadingSignal(configSignal: Signal<TableConfig>): Signal<boolean> {
  return computed(() => TableHelpers.shouldShowLoading(configSignal()));
}
