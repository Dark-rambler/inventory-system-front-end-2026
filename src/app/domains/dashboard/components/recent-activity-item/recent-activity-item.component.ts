import { DatePipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RecentActivity } from '../../interfaces/recent-activity.interface';

@Component({
  selector: 'app-recent-activity-item',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './recent-activity-item.component.html',
})
export class RecentActivityItemComponent {
  public activity = input.required<RecentActivity>();

  protected get title(): string {
    const rawTitle = this.activity().entity.split('|')[0]?.trim() || this.activity().entity;
    return this._translateEntity(rawTitle);
  }

  protected get subtitle(): string {
    return this.activity().entity.split('|')[1]?.trim() || `Usuario: ${this.activity().user}`;
  }

  protected get actionLabel(): string {
    switch (this.actionKey) {
      case 'add':
        return 'Agregó';
      case 'edit':
        return 'Editó';
      case 'delete':
        return 'Eliminó';
      default:
        return this.activity().action;
    }
  }

  protected get actionKey(): 'add' | 'edit' | 'delete' | 'other' {
    return this._normalizeAction(this.activity().action);
  }

  protected get iconClass(): string {
    switch (this.actionKey) {
      case 'add':
        return 'text-primary';
      case 'edit':
        return 'text-primary';
      case 'delete':
        return 'text-danger';
      default:
        return 'text-primary';
    }
  }

  private _normalizeAction(action: string): 'add' | 'edit' | 'delete' | 'other' {
    const normalizedAction = action.trim().toLowerCase();

    if (['add', 'agrego', 'agregó', 'agregar'].includes(normalizedAction)) {
      return 'add';
    }

    if (['edit', 'edito', 'editó', 'actualizo', 'actualizó'].includes(normalizedAction)) {
      return 'edit';
    }

    if (['delete', 'elimino', 'eliminó', 'eliminar'].includes(normalizedAction)) {
      return 'delete';
    }

    return 'other';
  }

  private _translateEntity(entity: string): string {
    const entityDictionary: Record<string, string> = {
      sale: 'Venta',
      movement: 'Movimiento',
      product: 'Producto',
      transfer: 'Transferencia',
      branch: 'Sucursal',
      warehouse: 'Almacén',
      inventory: 'Inventario',
      category: 'Categoría',
      user: 'Usuario',
    };

    return entityDictionary[entity.toLowerCase()] ?? entity;
  }
}
