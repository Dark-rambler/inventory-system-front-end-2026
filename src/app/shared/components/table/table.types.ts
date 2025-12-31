import { TemplateRef } from '@angular/core';

/**
 * Definición de una columna de la tabla
 */
export interface TableColumn<T> {
  /** Identificador único de la columna */
  key: string;
  /** Título visible en el encabezado */
  header: string;
  /** Template personalizado para las celdas */
  cellTemplate?: TemplateRef<TableCellContext<T>>;
  /** Clase CSS adicional para la columna */
  cssClass?: string;
  /** Ancho de la columna (opcional) */
  width?: string;
  /** Indica si la columna es ordenable */
  sortable?: boolean;
  /** Función para obtener el valor de la celda desde el objeto */
  valueGetter?: (row: T) => unknown;
}

/**
 * Contexto para templates personalizados de celdas
 */
export interface TableCellContext<T> {
  /** Dato de la fila actual */
  $implicit: T;
  /** Índice de la fila */
  index: number;
  /** Indica si es la primera fila */
  first: boolean;
  /** Indica si es la última fila */
  last: boolean;
  /** Indica si el índice es par */
  even: boolean;
  /** Indica si el índice es impar */
  odd: boolean;
}

/**
 * Configuración general de la tabla
 */
export interface TableConfig {
  /** Mensaje a mostrar cuando no hay datos */
  emptyMessage?: string;
  /** Indica si se debe mostrar el estado de carga */
  showLoading?: boolean;
  /** Número de filas del skeleton en loading */
  skeletonRows?: number;
  /** Habilitar hover en las filas */
  enableHover?: boolean;
  /** Habilitar filas alternadas */
  enableStriped?: boolean;
}

/**
 * Evento de acción sobre una fila
 */
export interface TableActionEvent<T> {
  /** Tipo de acción ejecutada */
  action: string;
  /** Datos de la fila */
  row: T;
  /** Índice de la fila */
  index: number;
}
