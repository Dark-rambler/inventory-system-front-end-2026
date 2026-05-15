import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../enums/role.enum';

@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  transform(role: Role | string | null | undefined): string {
    const roleNames: Record<Role, string> = {
      [Role.Admin]: 'Administrador',
      [Role.Seller]: 'Vendedor',
    };

    if (role === null || role === undefined || role === '') {
      return '';
    }

    if (typeof role === 'string') {
      const normalizedRole = role.trim().toLowerCase();

      if (normalizedRole === 'admin' || normalizedRole === 'administrator') {
        return roleNames[Role.Admin];
      }

      if (
        normalizedRole === 'seller' ||
        normalizedRole === 'vendor' ||
        normalizedRole === 'vendedor'
      ) {
        return roleNames[Role.Seller];
      }

      return role;
    }

    return roleNames[role] ?? '';
  }
}
