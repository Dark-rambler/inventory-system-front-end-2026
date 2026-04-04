import { Component } from '@angular/core';
import { WarehouseHeaderComponent } from './components/warehouse-header/warehouse-header.component';
import { WarehouseTableComponent } from './components/warehouse-table/warehouse-table.component';
import { WarehouseResourceService } from './services/warehouse-resource.service';

@Component({
  selector: 'app-warehouses',
  imports: [WarehouseHeaderComponent, WarehouseTableComponent],
  providers: [WarehouseResourceService],
  templateUrl: './warehouses.component.html',
})
export class WarehousesComponent {}
