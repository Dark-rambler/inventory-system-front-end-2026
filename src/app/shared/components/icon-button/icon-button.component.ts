import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IconButtonClassPipe } from './pipes/icon-button-class.pipe';
import { IconSizePipe } from './pipes/icon-size.pipe';
import { IconTooltipPipe } from './pipes/icon-tooltip.pipe';

export type IconButtonAction = 'view' | 'edit' | 'delete' | 'download' | 'share' | 'more';
export type IconButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule, IconButtonClassPipe, IconSizePipe, IconTooltipPipe],
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  public action = input.required<IconButtonAction>();

  public tooltip = input<string>('');

  public size = input<IconButtonSize>('md');

  public disabled = input<boolean>(false);

  public buttonClick = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      event.stopPropagation();
      this.buttonClick.emit(event);
    }
  }
}
