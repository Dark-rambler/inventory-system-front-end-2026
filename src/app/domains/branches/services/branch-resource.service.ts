import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { BranchService } from '../../../shared/services/branch.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Branch } from '../../../shared/interfaces/branch.interface';
import { BranchParams } from '../interfaces/branch-params.interface';
import { DEFAULT_GET_BRANCH_PARAMS } from '../constants/default-branch-params.constants';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { BRANCH_PARAMETER_MAPPING } from '../constants/branch-mapping.constant';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class BranchResourceService {
  private readonly _branchService: BranchService = inject(BranchService);

  public filterBranchParameters = signal<BranchParams>(DEFAULT_GET_BRANCH_PARAMS);

  public readonly branchResource = rxResource({
    request: () => {
      const filters = this.filterBranchParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getBranch(request);
    },
  });

  public branchData = linkedSignal(() => this.branchResource.value() ?? null);
  public isLoading = this.branchResource.isLoading;
  public reloadBranch = () => this.branchResource.reload();

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterBranchParameters())
  );

  private _getBranch(request: BranchParams): Observable<PaginatorInterface<Branch>> {
    const params = this._createRequest(request);
    return this._branchService.getAll(params);
  }

  private _createRequest(request: BranchParams): HttpParams {
    return buildHttpParams(request, BRANCH_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: BranchParams): boolean {
    const hasStringFilters = !!(params.name || params.location || params.page || params.pageSize);
    return hasStringFilters;
  }
}
