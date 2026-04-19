import { Component, input } from '@angular/core';

@Component({
  selector: 'app-recent-activity-skeleton',
  standalone: true,
  templateUrl: './recent-activity-skeleton.component.html',
})
export class RecentActivitySkeletonComponent {
  public rows = input<number[]>([]);
}
