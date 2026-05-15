import { Component } from '@angular/core';
import { CustomerHeaderComponent } from './components/customer-header/customer-header.component';
import { CustomersFiltersComponent } from './components/customers-filters/customers-filters.component';
import { CustomersTableComponent } from './components/customers-table/customers-table.component';
import { CustomerResourceService } from './services/customer-resource.service';

@Component({
  selector: 'app-customers',
  imports: [CustomerHeaderComponent, CustomersFiltersComponent, CustomersTableComponent],
  templateUrl: './customers.component.html',
  providers: [CustomerResourceService],
})
export class CustomersComponent {}
