import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Dialog } from '@angular/cdk/dialog';
import { BranchModalComponent } from '@app/shared/components/branch-modal/branch-modal.component';
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  private _dialog = inject(Dialog);
  ngOnInit(): void {
    if (!localStorage.getItem('selectedBranch')) {
      this._dialog.open(BranchModalComponent);
    }
  }
  isSidebarOpen = true;
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onSidebarCollapse(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
