import { Component } from '@angular/core';
import { SalesFiltersComponent } from './components/sales-filters/sales-filters.component';
import { SalesHeaderComponent } from './components/sales-header/sales-header.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';
import { SalesResourceService } from './services/sales-resource.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [SalesHeaderComponent, SalesFiltersComponent, SalesTableComponent],
  providers: [SalesResourceService],
  templateUrl: './sales.component.html',
})
export class SalesComponent {}
