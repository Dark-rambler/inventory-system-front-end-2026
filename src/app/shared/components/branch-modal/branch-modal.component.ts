import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { ButtonComponent } from '@shared/components/button';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { Branch } from '@shared/interfaces/branch.interface';
import { BranchService } from '@shared/services/branch.service';

@Component({
  selector: 'app-branch-modal',
  imports: [ModalComponent, ButtonComponent],
  templateUrl: './branch-modal.component.html',
})
export class BranchModalComponent implements OnInit {
  private readonly _branchService = inject(BranchService);
  private readonly _selectedBranchStorageKey = 'selectedBranch';
  private readonly _dialog = inject(Dialog);
  protected branches = signal<Branch[]>([]);
  protected selectedBranch = signal<Branch | null>(null);
  protected isLoading = signal<boolean>(true);

  readonly branchSelected = output<Branch>();

  ngOnInit(): void {
    this.loadBranches();
  }

  private loadBranches(): void {
    this._branchService.getAll().subscribe({
      next: response => {
        this.branches.set(response.items);
        this.restoreSelectedBranch();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  protected selectBranch(branch: Branch): void {
    this.selectedBranch.set(branch);
  }

  protected confirmSelection(): void {
    const branch = this.selectedBranch();
    if (branch) {
      localStorage.setItem(this._selectedBranchStorageKey, JSON.stringify(branch));
      this.branchSelected.emit(branch);
      this._dialog.closeAll();
    }
  }

  protected onClose(): void {
    this.branchSelected.emit(undefined as never);
    this._dialog.closeAll();
  }

  private restoreSelectedBranch(): void {
    const storedBranch = localStorage.getItem(this._selectedBranchStorageKey);
    if (!storedBranch) {
      return;
    }

    const parsedBranch = JSON.parse(storedBranch) as Branch;
    const foundBranch = this.branches().find(branch => branch.id === parsedBranch.id);
    if (foundBranch) {
      this.selectedBranch.set(foundBranch);
    }
  }
}
