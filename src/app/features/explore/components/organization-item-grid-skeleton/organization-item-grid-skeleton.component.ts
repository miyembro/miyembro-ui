import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-organization-item-grid-skeleton',
  imports: [CommonModule, Skeleton],
  templateUrl: './organization-item-grid-skeleton.component.html',
  styleUrl: './organization-item-grid-skeleton.component.scss'
})
export class OrganizationItemGridSkeletonComponent {

}
