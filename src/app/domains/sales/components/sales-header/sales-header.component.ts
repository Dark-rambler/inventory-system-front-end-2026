import { Component, computed, inject } from '@angular/core';
import { Branch } from '@shared/interfaces/branch.interface';
import { AuthService } from '@shared/services/auth.service';
import { getSelectedBranchFromStorage } from '@shared/utils/selected-branch-storage';

@Component({
  selector: 'app-sales-header',
  templateUrl: './sales-header.component.html',
})
export class SalesHeaderComponent {
  private readonly _authService = inject(AuthService);

  protected readonly currentBranch = computed(() => {
    const fromState = this._authService.selectedBranch()?.name;
    if (fromState) {
      return fromState;
    }

    const fromStorage = getSelectedBranchFromStorage<Branch>()?.name;
    return fromStorage ?? 'Sin sucursal';
  });

  handleNewSale(): void {
    console.log('Nueva venta');
  }
}
