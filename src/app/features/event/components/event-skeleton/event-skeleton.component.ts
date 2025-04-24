import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-event-skeleton',
  imports: [
    CardModule,
    CommonModule, 
    Skeleton
  ],
  templateUrl: './event-skeleton.component.html',
  styleUrl: './event-skeleton.component.scss',
})
export class EventSkeletonComponent {

  @Input() isVerticalAlign = false;
}
