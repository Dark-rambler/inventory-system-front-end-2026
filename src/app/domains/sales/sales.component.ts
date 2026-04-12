import { Component } from '@angular/core';
import { SalesHeaderComponent } from './components/sales-header/sales-header.component';
import { SalesTableComponent } from './components/sales-table/sales-table.component';
import { SalesResourceService } from './services/sales-resource.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [SalesHeaderComponent, SalesTableComponent],
  providers: [SalesResourceService],
  templateUrl: './sales.component.html',
})
export class SalesComponent {}
