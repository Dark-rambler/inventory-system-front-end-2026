import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AppRole,
  hasRoleAccess,
  normalizeUserRole,
  ROLE_ACCESS,
} from '@shared/constants/role-access.constant';
import { Branch } from '@shared/interfaces/branch.interface';
import { AuthService } from '@shared/services/auth.service';
import { BranchModalComponent } from '../branch-modal/branch-modal.component';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: readonly AppRole[];
}

interface MenuGroup {
  id: string;
  label: string;
  icon: string;
  items: MenuItem[];
  roles?: readonly AppRole[];
  defaultExpanded?: boolean;
  collapsible?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, BranchModalComponent],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _expandedGroups = signal<Record<string, boolean>>({});

  isOpen = input<boolean>(true);
  sidebarClose = output<void>();
  sidebarCollapse = output<boolean>();

  isCollapsed = false;
  showBranchModal = false;

  get selectedBranch(): Branch | null {
    return this._authService.selectedBranch();
  }

  readonly menuGroups: MenuGroup[] = [
    {
      id: 'general',
      label: 'General',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      collapsible: false,
      defaultExpanded: false,
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
          roles: ROLE_ACCESS.dashboard,
        },
      ],
      roles: ROLE_ACCESS.dashboard,
    },
    {
      id: 'catalogos',
      label: 'Catálogos',
      icon: 'M4 6h16M4 12h16M4 18h16',
      defaultExpanded: false,
      items: [
        {
          label: 'Productos',
          path: '/products',
          icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
          roles: ROLE_ACCESS.products,
        },
        {
          label: 'Categorías',
          path: '/categories',
          icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z',
          roles: ROLE_ACCESS.categories,
        },
        {
          label: 'Proveedores',
          path: '/suppliers',
          icon: 'M17 9V7a5 5 0 00-10 0v2m-2 0h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z',
          roles: ROLE_ACCESS.suppliers,
        },
        {
          label: 'Almacenes',
          path: '/warehouses',
          icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
          roles: ROLE_ACCESS.warehouses,
        },
        {
          label: 'Sucursales',
          path: '/branches',
          icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
          roles: ROLE_ACCESS.branches,
        },
        {
          label: 'Clientes',
          path: '/customers',
          icon: 'M17 20h5v-1a4 4 0 00-5.356-3.77M17 20H7m10 0v-1c0-.656-.126-1.283-.356-1.857M7 20H2v-1a4 4 0 015.356-3.77M7 20v-1c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM5 10a2 2 0 11-4 0 2 2 0 014 0z',
          roles: ROLE_ACCESS.customers,
        },
        {
          label: 'Business',
          path: '/business',
          icon: 'M3 21h18M5 21V7l8-4 8 4v14M9 9h8M9 13h8M9 17h8',
          roles: ROLE_ACCESS.business,
        },
      ],
      roles: ROLE_ACCESS.products,
    },
    {
      id: 'operaciones',
      label: 'Operaciones',
      icon: 'M13 7l5 5m0 0l-5 5m5-5H6m5-7l-5 5m0 0l5 5m-5-5h12',
      defaultExpanded: false,
      items: [
        {
          label: 'Inventario',
          path: '/inventory',
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
          roles: ROLE_ACCESS.inventory,
        },
        {
          label: 'Movimientos',
          path: '/movements',
          icon: 'M13 7l5 5m0 0l-5 5m5-5H6m5-7l-5 5m0 0l5 5m-5-5h12',
          roles: ROLE_ACCESS.movements,
        },
        {
          label: 'Punto de venta',
          path: '/pos',
          icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
          roles: ROLE_ACCESS.pos,
        },
        {
          label: 'Compras',
          path: '/purchases',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          roles: ROLE_ACCESS.purchases,
        },
        {
          label: 'Ventas',
          path: '/sales',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          roles: ROLE_ACCESS.sales,
        },
      ],
      roles: ROLE_ACCESS.movements,
    },
    {
      id: 'administracion',
      label: 'Administración',
      icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 4a7.1 7.1 0 00-.12-1.24l2.04-1.59-1.92-3.32-2.45.99a7.93 7.93 0 00-2.15-1.24l-.37-2.62h-3.84l-.37 2.62c-.78.3-1.5.72-2.15 1.24l-2.45-.99-1.92 3.32 2.04 1.59A7.1 7.1 0 003.06 12c0 .42.04.83.12 1.24l-2.04 1.59 1.92 3.32 2.45-.99c.65.52 1.37.94 2.15 1.24l.37 2.62h3.84l.37-2.62c.78-.3 1.5-.72 2.15-1.24l2.45.99 1.92-3.32-2.04-1.59c.08-.41.12-.82.12-1.24z',
      defaultExpanded: false,
      items: [
        {
          label: 'Usuarios',
          path: '/users',
          icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
          roles: ROLE_ACCESS.users,
        },
        {
          label: 'Reportes',
          path: '/reports',
          icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
          roles: ROLE_ACCESS.reports,
        },
        {
          label: 'Configuración',
          path: '/settings',
          icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
          roles: ROLE_ACCESS.settings,
        },
      ],
      roles: ROLE_ACCESS.users,
    },
  ];

  readonly visibleMenuGroups = computed(() =>
    (() => {
      const isSeller = normalizeUserRole(this._authService.currentRole()) === 'seller';

      return this.menuGroups
        .filter(group => this._hasRoleAccess(group.roles))
        .map(group => ({
          ...group,
          collapsible: isSeller ? false : group.collapsible,
          items: group.items.filter(item => this._hasRoleAccess(item.roles)),
        }))
        .filter(group => group.items.length > 0);
    })()
  );

  constructor() {
    this._expandedGroups.set(
      this.menuGroups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.id] = group.defaultExpanded ?? true;
        return acc;
      }, {})
    );
  }

  openBranchModal(): void {
    this.showBranchModal = true;
  }

  onBranchSelected(branch: Branch): void {
    if (branch) {
      this._authService.setSelectedBranch(branch);
    }
    this.showBranchModal = false;
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;

    if (this.isCollapsed) {
      this._collapseAllGroups();
    }

    this.sidebarCollapse.emit(this.isCollapsed);
  }

  toggleGroup(groupId: string): void {
    if (this.isCollapsed) {
      return;
    }

    this._expandedGroups.update(current => ({
      ...current,
      [groupId]: !this.isGroupExpanded(groupId),
    }));
  }

  isGroupExpanded(groupId: string): boolean {
    return this._expandedGroups()[groupId] ?? true;
  }

  isGroupActive(group: Pick<MenuGroup, 'items'>): boolean {
    return group.items.some(item => this._isPathActive(item.path));
  }

  closeSidebar() {
    this._collapseAllGroups();
    this.sidebarClose.emit();
  }

  logout(): void {
    this._authService.logout();
  }

  private _collapseAllGroups(): void {
    const collapsed = this.visibleMenuGroups().reduce<Record<string, boolean>>((acc, group) => {
      acc[group.id] = false;
      return acc;
    }, {});

    this._expandedGroups.set(collapsed);
  }

  private _hasRoleAccess(roles?: readonly AppRole[]): boolean {
    return hasRoleAccess(this._authService.currentRole(), roles);
  }

  private _isPathActive(path: string): boolean {
    return this._router.url === path || this._router.url.startsWith(`${path}/`);
  }
}
