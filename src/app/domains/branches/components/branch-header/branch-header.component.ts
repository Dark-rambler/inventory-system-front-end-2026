import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalBranchComponent } from '../modal-branch/modal-branch.component';

@Component({
  selector: 'app-branch-header',
  imports: [ButtonComponent],
  templateUrl: './branch-header.component.html',
  styleUrl: './branch-header.component.scss',
})
export class BranchHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  handleNewBranch(): void {
    this._dialogService.open(ModalBranchComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
