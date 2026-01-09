import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Category } from '../../../shared/interfaces/category.interface';
import { CategoryParams } from '../interfaces/category-params.interface';
import { DEFAULT_GET_CATEGORY_PARAMS } from '../constants/default-category-params.constants';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { CATEGORY_PARAMETER_MAPPING } from '../constants/category-maping.constant';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class CategoryResourceService {
  private readonly _categoryService: CategoryService = inject(CategoryService);

  public filterCategoryParameters = signal<CategoryParams>(DEFAULT_GET_CATEGORY_PARAMS);

  public readonly categoryResource = rxResource({
    request: () => {
      const filters = this.filterCategoryParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getCategory(request);
    },
  });

  public categoryData = linkedSignal(() => this.categoryResource.value() ?? null);
  public isLoading = this.categoryResource.isLoading;
  public reloadCategory = () => this.categoryResource.reload();

  public isEmpty = linkedSignal(() => this.categoryData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterCategoryParameters())
  );

  private _getCategory(request: CategoryParams): Observable<PaginatorInterface<Category>> {
    const params = this._createRequest(request);
    return this._categoryService.getAll(params);
  }

  private _createRequest(request: CategoryParams): HttpParams {
    return buildHttpParams(request, CATEGORY_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: CategoryParams): boolean {
    const hasStringFilters = !!(params.name || params.page || params.pageSize);

    return hasStringFilters;
  }
}
