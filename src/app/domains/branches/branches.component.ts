import { Component } from '@angular/core';
import { BranchHeaderComponent } from './components/branch-header/branch-header.component';
import { BranchTableComponent } from './components/branch-table/branch-table.component';
import { BranchesFiltersComponent } from './components/branches-filters/branches-filters.component';
import { BranchResourceService } from './services/branch-resource.service';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [BranchHeaderComponent, BranchesFiltersComponent, BranchTableComponent],
  providers: [BranchResourceService],
  templateUrl: './branches.component.html',
})
export class BranchesComponent {}
