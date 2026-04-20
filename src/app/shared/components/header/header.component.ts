import { Component, inject, output } from '@angular/core';
import { RolePipe } from '@app/shared/pipes/role.pipe';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RolePipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  sidebarToggle = output<void>();
  protected _authService = inject(AuthService);
  protected userName = this._authService.currentUsername;
  protected currentRole = this._authService.currentRole;

  protected toggleSidebar() {
    this.sidebarToggle.emit();
  }
}
