import { HttpParams } from '@angular/common/http';

export const buildHttpParams = <T>(data: T, mapping: Record<string, string>): HttpParams => {
  let params = new HttpParams();

  Object.entries(mapping).forEach(([dataKey, paramName]) => {
    const value = (data as Record<string, unknown>)[dataKey];
    if (value !== undefined && value !== null) {
      params = params.set(paramName, String(value));
    }
  });

  return params;
};
