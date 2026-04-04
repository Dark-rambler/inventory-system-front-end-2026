import { Component } from '@angular/core';
import { InventoryHeaderComponent } from './components/inventory-header/inventory-header.component';
import { InventoryTableComponent } from './components/inventory-table';
import { InventoryResourceService } from './services/inventory-resource.service';

@Component({
  selector: 'app-inventory',
  imports: [InventoryHeaderComponent, InventoryTableComponent],
  providers: [InventoryResourceService],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent {}
