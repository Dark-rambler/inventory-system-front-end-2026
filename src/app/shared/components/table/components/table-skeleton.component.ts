import { Component, input } from '@angular/core';
import { TableColumn } from '../table.types';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  templateUrl: './table-skeleton.component.html',
})
export class TableSkeletonComponent<T = unknown> {
  columns = input.required<TableColumn<T>[]>();
  skeletonArray = input.required<number[]>();
}
