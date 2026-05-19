import { Component } from '@angular/core';
import { BusinessFiltersComponent } from './components/business-filters/business-filters.component';
import { BusinessHeaderComponent } from './components/business-header/business-header.component';
import { BusinessTableComponent } from './components/business-table/business-table.component';
import { BusinessResourceService } from './services/business-resource.service';

@Component({
  selector: 'app-business',
  imports: [BusinessHeaderComponent, BusinessFiltersComponent, BusinessTableComponent],
  templateUrl: './business.component.html',
  providers: [BusinessResourceService],
})
export class BusinessComponent {}
