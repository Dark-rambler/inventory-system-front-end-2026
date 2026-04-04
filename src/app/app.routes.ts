import { Routes } from '@angular/router';
import { authGuard, publicGuard } from '@shared/guards/auth.guard';

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
        loadComponent: () =>
          import('./domains/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./domains/inventory/inventory.component').then(m => m.InventoryComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./domains/reports/reports.component').then(m => m.ReportsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./domains/settings/settings.component').then(m => m.SettingsComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./domains/categories/categories.component').then(m => m.CategoriesComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./domains/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'warehouses',
        loadComponent: () =>
          import('./domains/warehouses/warehouses.component').then(m => m.WarehousesComponent),
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./domains/branches/branches.component').then(m => m.BranchesComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
