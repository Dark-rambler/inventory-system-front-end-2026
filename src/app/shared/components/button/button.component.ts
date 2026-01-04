import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonClassPipe } from './pipes/button-class.pipe';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, ButtonClassPipe],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  public label = input<string>('');
  public variant = input<ButtonVariant>('primary');
  public size = input<ButtonSize>('md');
  public disabled = input<boolean>(false);
  public loading = input<boolean>(false);
  public type = input<'button' | 'submit' | 'reset'>('button');
  public customClass = input<string>('');
  public buttonClick = output<MouseEvent>();

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.buttonClick.emit(event);
    }
  }
}
