import { Component } from '@angular/core';
import { BranchHeaderComponent } from './components/branch-header/branch-header.component';
import { BranchTableComponent } from './components/branch-table/branch-table.component';
import { BranchResourceService } from './services/branch-resource.service';

@Component({
  selector: 'app-branches',
  imports: [BranchHeaderComponent, BranchTableComponent],
  providers: [BranchResourceService],
  templateUrl: './branches.component.html',
})
export class BranchesComponent {}
