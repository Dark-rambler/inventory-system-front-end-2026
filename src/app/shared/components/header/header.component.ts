import { Component, inject, output } from '@angular/core';
import { RolePipe } from '@app/shared/pipes/role.pipe';
import { AuthService } from '@app/shared/services/auth.service';
import { ThemeService } from '@app/shared/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RolePipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  sidebarToggle = output<void>();
  protected readonly _authService = inject(AuthService);
  private readonly _themeService = inject(ThemeService);
  protected readonly bussinesName = this._authService.getBusinessName();

  protected readonly userName = this._authService.currentUsername;
  protected readonly currentRole = this._authService.currentRole;
  protected readonly isDarkMode = this._themeService.isDarkTheme;

  protected toggleSidebar() {
    this.sidebarToggle.emit();
  }

  protected toggleTheme(): void {
    this._themeService.toggleTheme();
  }
}
