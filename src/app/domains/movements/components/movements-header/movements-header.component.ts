import { Router } from '@angular/router';
import { Component, inject, input } from '@angular/core';
import { getSelectedBranchIdFromStorage } from '@shared/utils/selected-branch-storage';
import { ButtonComponent } from '../../../../shared/components/button';

@Component({
  selector: 'app-movements-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './movements-header.component.html',
})
export class MovementsHeaderComponent {
  public title = input<string>('Movimientos de productos');
  public branchId = input<string | null>(null);
  public showCreateButton = input<boolean>(true);
  private readonly _router = inject(Router);

  protected handleNewMovement(): void {
    const currentBranchId = this.branchId() ?? getSelectedBranchIdFromStorage();
    if (!currentBranchId) {
      return;
    }

    this._router.navigate(['branches', currentBranchId, 'movements', 'new']);
  }
}
