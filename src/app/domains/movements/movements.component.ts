import { Component } from '@angular/core';
import { MovementTableComponent } from './components/movement-table';
import { MovementsFiltersComponent } from './components/movements-filters/movements-filters.component';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';
import { MovementResourceService } from './services/movement-resource.service';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [MovementsHeaderComponent, MovementsFiltersComponent, MovementTableComponent],
  providers: [MovementResourceService],
  templateUrl: './movements.component.html',
})
export class MovementsComponent {}
