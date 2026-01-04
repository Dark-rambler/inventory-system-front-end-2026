import { Pipe, PipeTransform } from '@angular/core';
import { ButtonSize, ButtonVariant } from '../button.component';

@Pipe({
  name: 'buttonClass',
  standalone: true,
  pure: true,
})
export class ButtonClassPipe implements PipeTransform {
  private readonly BASE_CLASSES =
    'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  private readonly VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary:
      'px-6 py-3 bg-[#288B83] text-white hover:bg-[#1f6f69] active:bg-[#1a5c57] focus:ring-[#288B83] shadow-sm hover:shadow-md',
    secondary:
      'px-6 py-3 bg-[#A1CBC7] text-[#1E1E1E] hover:bg-[#8bb5b1] active:bg-[#7aa19d] focus:ring-[#A1CBC7]',
    outline:
      'px-6 py-3 border-2 border-[#288B83] text-[#288B83] hover:bg-[#288B83] hover:text-white focus:ring-[#288B83]',
    danger: 'px-6 py-3 bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
  };

  private readonly SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  /**
   * Transforma los parámetros del botón en clases CSS
   * @param variant Variante del botón
   * @param size Tamaño del botón
   * @param disabled Si está deshabilitado
   * @param loading Si está en estado de carga
   * @param customClass Clases CSS adicionales
   * @returns String con todas las clases CSS concatenadas
   */
  transform(
    variant: ButtonVariant,
    size: ButtonSize,
    disabled: boolean,
    loading: boolean,
    customClass = ''
  ): string {
    const variantClass = this.VARIANT_CLASSES[variant] || this.VARIANT_CLASSES.primary;
    const sizeClass = this.SIZE_CLASSES[size] || this.SIZE_CLASSES.md;
    const stateClass =
      disabled || loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

    return `${this.BASE_CLASSES} ${variantClass} ${sizeClass} ${stateClass} ${customClass}`.trim();
  }
}
