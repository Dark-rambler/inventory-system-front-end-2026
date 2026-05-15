import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {
  AppRole,
  hasRoleAccess,
  resolveDefaultRouteByRole,
} from '@shared/constants/role-access.constant';
import { AuthService } from '@shared/services/auth.service';

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentRole = authService.currentRole();
  const allowedRoles = route.data?.['roles'] as readonly AppRole[] | undefined;

  if (hasRoleAccess(currentRole, allowedRoles)) {
    return true;
  }

  const fallbackRoute = resolveDefaultRouteByRole(currentRole);

  if (fallbackRoute === '/login') {
    authService.logout();
    return false;
  }

  return router.createUrlTree([fallbackRoute]);
};
