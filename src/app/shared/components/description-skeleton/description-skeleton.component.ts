import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-description-skeleton',
  imports: [
    CommonModule,
    Skeleton
  ],
  templateUrl: './description-skeleton.component.html',
  styleUrl: './description-skeleton.component.scss',
})
export class DescriptionSkeletonComponent {}
