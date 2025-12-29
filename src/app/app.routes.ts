import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./domains/products/products.component').then(m => m.ProductsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
