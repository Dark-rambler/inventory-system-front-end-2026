import { Component } from '@angular/core';
import { PurchaseHeaderComponent } from './components/purchase-header/purchase-header.component';
import { PurchaseTableComponent } from './components/purchase-table';
import { PurchasesFiltersComponent } from './components/purchases-filters/purchases-filters.component';
import { PurchaseResourceService } from './services/purchase-resource.service';

@Component({
  selector: 'app-purchases',
  imports: [PurchaseHeaderComponent, PurchasesFiltersComponent, PurchaseTableComponent],
  providers: [PurchaseResourceService],
  templateUrl: './purchases.component.html',
})
export class PurchasesComponent {}
