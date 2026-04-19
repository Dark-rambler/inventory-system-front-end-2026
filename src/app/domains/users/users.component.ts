import { Component } from '@angular/core';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UserTableComponent } from './components/user-table';
import { UsersFiltersComponent } from './components/users-filters/users-filters.component';
import { UserResourceService } from './services/user-resource.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserHeaderComponent, UsersFiltersComponent, UserTableComponent],
  providers: [UserResourceService],
  templateUrl: './users.component.html',
})
export class UsersComponent {}
