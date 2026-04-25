import { Component } from '@angular/core';
import { SupplierHeaderComponent } from './components/supplier-header/supplier-header.component';
import { SupplierTableComponent } from './components/supplier-table';
import { SuppliersFiltersComponent } from './components/suppliers-filters/suppliers-filters.component';
import { SupplierResourceService } from './services/supplier-resource.service';

@Component({
  selector: 'app-suppliers',
  imports: [SupplierHeaderComponent, SuppliersFiltersComponent, SupplierTableComponent],
  providers: [SupplierResourceService],
  templateUrl: './suppliers.component.html',
})
export class SuppliersComponent {}
