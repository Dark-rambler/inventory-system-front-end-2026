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
      return value ?? fallback;
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

    return value ?? fallback;
  }
}
