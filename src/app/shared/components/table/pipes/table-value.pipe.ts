import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe para extraer valores de objetos anidados o aplicar transformaciones
 * Soporta fallback cuando el valor es null o undefined
 */
@Pipe({
  name: 'tableValue',
  standalone: true,
})
export class TableValuePipe implements PipeTransform {
  transform<T>(row: T, accessor: string | ((row: T) => unknown), fallback = '-'): unknown {
    if (typeof accessor === 'function') {
      const value = accessor(row);
      return this._formatIsoDateIfNeeded(value ?? fallback);
    }

    // Soporta acceso a propiedades anidadas como 'user.name'
    const keys = accessor.split('.');
    let value: unknown = row;

    for (const key of keys) {
      if (value === null || value === undefined) {
        return fallback;
      }
      value = (value as Record<string, unknown>)[key];
    }

    return this._formatIsoDateIfNeeded(value ?? fallback);
  }

  private _formatIsoDateIfNeeded(value: unknown): unknown {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return value;
      }

      return formatDate(value, 'dd/MM/yyyy HH:mm', 'es-ES');
    }

    if (typeof value !== 'string') {
      return value;
    }

    const trimmedValue = value.trim();
    if (!this._isIsoDateString(trimmedValue)) {
      return value;
    }

    const parsedDate = new Date(trimmedValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return formatDate(parsedDate, 'dd/MM/yyyy HH:mm', 'es-ES');
  }

  private _isIsoDateString(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  }
}
