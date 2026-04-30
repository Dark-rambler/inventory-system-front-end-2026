export type AppRole = 'admin' | 'seller';

export const ROLE_ACCESS = {
  dashboard: ['admin'],
  products: ['admin'],
  inventory: ['admin'],
  movements: ['admin', 'seller'],
  reports: ['admin'],
  settings: ['admin'],
  categories: ['admin'],
  suppliers: ['admin'],
  users: ['admin'],
  warehouses: ['admin'],
  branches: ['admin'],
  branchMovements: ['admin'],
  branchMovementCreate: ['admin'],
  pos: ['admin', 'seller'],
  sales: ['admin'],
  purchases: ['admin', 'seller'],
} as const satisfies Record<string, readonly AppRole[]>;

const SELLER_ROLE_ALIASES = new Set(['seller', 'vendor', 'vendedor', 'cashier']);
const ADMIN_ROLE_ALIASES = new Set(['admin', 'administrator', 'manager']);

export function normalizeUserRole(role: string | null | undefined): AppRole | null {
  const normalizedRole = role?.trim().toLowerCase();

  if (!normalizedRole) {
    return null;
  }

  if (ADMIN_ROLE_ALIASES.has(normalizedRole)) {
    return 'admin';
  }

  if (SELLER_ROLE_ALIASES.has(normalizedRole)) {
    return 'seller';
  }

  return null;
}

export function hasRoleAccess(
  role: string | null | undefined,
  allowedRoles?: readonly AppRole[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const normalizedRole = normalizeUserRole(role);
  if (!normalizedRole) {
    return false;
  }

  return allowedRoles.includes(normalizedRole);
}

export function resolveDefaultRouteByRole(role: string | null | undefined): string {
  const normalizedRole = normalizeUserRole(role);

  if (normalizedRole === 'seller') {
    return '/pos';
  }

  if (normalizedRole === 'admin') {
    return '/dashboard';
  }

  return '/login';
}
