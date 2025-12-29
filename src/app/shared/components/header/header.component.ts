import { Component, output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  sidebarToggle = output<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}
