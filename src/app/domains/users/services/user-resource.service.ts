import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { UserParams } from '../interfaces/user-params.interface';
import { DEFAULT_GET_USER_PARAMS } from '../constants/default-user-params.constants';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { USER_PARAMETER_MAPPING } from '../constants/user-mapping.constant';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserResourceService {
  private readonly _userService: UserService = inject(UserService);

  public filterUserParameters = signal<UserParams>(DEFAULT_GET_USER_PARAMS);

  public readonly userResource = rxResource({
    request: () => {
      const filters = this.filterUserParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getUser(request);
    },
  });

  public userData = linkedSignal(() => this.userResource.value() ?? null);
  public isLoading = this.userResource.isLoading;
  public reloadUser = () => this.userResource.reload();

  public isEmpty = linkedSignal(() => this.userData());

  public hasActiveFilters = linkedSignal(() => this._hasActiveFilters(this.filterUserParameters()));

  private _getUser(request: UserParams): Observable<PaginatorInterface<User>> {
    const params = this._createRequest(request);
    return this._userService.getAll(params);
  }

  private _createRequest(request: UserParams): HttpParams {
    return buildHttpParams(request, USER_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: UserParams): boolean {
    const hasStringFilters = !!(
      params.name ||
      params.userName ||
      params.email ||
      params.role ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
