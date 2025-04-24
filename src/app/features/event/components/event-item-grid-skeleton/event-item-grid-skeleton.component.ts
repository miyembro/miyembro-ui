import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-event-item-grid-skeleton',
  imports: [CommonModule, Skeleton],
  templateUrl: './event-item-grid-skeleton.component.html',
  styleUrl: './event-item-grid-skeleton.component.scss',
})
export class EventItemGridSkeletonComponent {}
