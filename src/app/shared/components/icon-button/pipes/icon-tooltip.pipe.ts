import { Pipe, PipeTransform } from '@angular/core';
import { IconButtonAction } from '../icon-button.component';

@Pipe({
  name: 'iconTooltip',
  standalone: true,
  pure: true,
})
export class IconTooltipPipe implements PipeTransform {
  transform(action: IconButtonAction, customTooltip?: string): string {
    if (customTooltip) return customTooltip;

    const defaultTooltips: Record<IconButtonAction, string> = {
      view: 'Ver detalles',
      edit: 'Editar',
      save: 'Guardar',
      delete: 'Eliminar',
      download: 'Descargar',
      share: 'Compartir',
      more: 'Más opciones',
    };

    return defaultTooltips[action];
  }
}
