import { Routes } from '@angular/router';
import { ROLE_ACCESS } from '@shared/constants/role-access.constant';
import { authGuard, publicGuard } from '@shared/guards/auth.guard';
import { roleGuard } from '@shared/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('@shared/components/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.dashboard },
        loadComponent: () =>
          import('./domains/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'products',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.products },
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'inventory',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.inventory },
        loadComponent: () =>
          import('./domains/inventory/inventory.component').then(m => m.InventoryComponent),
      },
      {
        path: 'movements',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.movements },
        loadComponent: () =>
          import('./domains/movements/movements.component').then(m => m.MovementsComponent),
      },
      {
        path: 'reports',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.reports },
        loadComponent: () =>
          import('./domains/reports/reports.component').then(m => m.ReportsComponent),
      },
      {
        path: 'settings',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.settings },
        loadComponent: () =>
          import('./domains/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'categories',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.categories },
        loadComponent: () =>
          import('./domains/categories/categories.component').then(m => m.CategoriesComponent),
      },
      {
        path: 'suppliers',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.suppliers },
        loadComponent: () =>
          import('./domains/suppliers/suppliers.component').then(m => m.SuppliersComponent),
      },
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.users },
        loadComponent: () => import('./domains/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'warehouses/:warehouseId/details',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.warehouses },
        loadComponent: () =>
          import('./domains/warehouses/warehouse-branch-details.component').then(
            m => m.WarehouseBranchDetailsComponent
          ),
      },
      {
        path: 'warehouses',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.warehouses },
        loadComponent: () =>
          import('./domains/warehouses/warehouses.component').then(m => m.WarehousesComponent),
      },
      {
        path: 'branches',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.branches },
        loadComponent: () =>
          import('./domains/branches/branches.component').then(m => m.BranchesComponent),
      },
      {
        path: 'branches/:branchId/movements/new',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.branchMovementCreate },
        loadComponent: () =>
          import('./domains/movements/components/movements-header/create-branch-movement/create-branch-movement.component').then(
            m => m.CreateBranchMovementComponent
          ),
      },
      {
        path: 'branches/:branchId/movements',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.branchMovements },
        loadComponent: () =>
          import('./domains/movements/branch-movements.component').then(
            m => m.BranchMovementsComponent
          ),
      },
      {
        path: 'pos',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.pos },
        loadComponent: () => import('./domains/pos/pos.component').then(m => m.PosComponent),
      },
      {
        path: 'sales',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.sales },
        loadComponent: () => import('./domains/sales/sales.component').then(m => m.SalesComponent),
      },
      {
        path: 'purchases',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.purchases },
        loadComponent: () =>
          import('./domains/purchases/purchases.component').then(m => m.PurchasesComponent),
      },
      {
        path: 'customers',
        canActivate: [roleGuard],
        data: { roles: ROLE_ACCESS.users },
        loadComponent: () =>
          import('./domains/customers/customers.component').then(m => m.CustomersComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
