import { Component } from '@angular/core';
import { InventoryFiltersComponent } from './components/inventory-filters/inventory-filters.component';
import { InventoryHeaderComponent } from './components/inventory-header/inventory-header.component';
import { InventoryTableComponent } from './components/inventory-table';
import { InventoryResourceService } from './services/inventory-resource.service';
import { BranchMissingProductsResourceService } from '../movements/services/branch-missing-products-resource.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [InventoryHeaderComponent, InventoryFiltersComponent, InventoryTableComponent],
  providers: [InventoryResourceService, BranchMissingProductsResourceService],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {}
