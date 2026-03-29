import { Component } from '@angular/core';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UserTableComponent } from './components/user-table';
import { UserResourceService } from './services/user-resource.service';

@Component({
  selector: 'app-users',
  imports: [UserHeaderComponent, UserTableComponent],
  providers: [UserResourceService],
  templateUrl: './users.component.html',
})
export class UsersComponent {}
