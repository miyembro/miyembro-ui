import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-contact-details-skeleton',
  imports: [
    CommonModule,
    Skeleton
  ],
  templateUrl: './contact-details-skeleton.component.html',
  styleUrl: './contact-details-skeleton.component.scss',
})
export class ContactDetailsSkeletonComponent {

  @Input() showTitleHeader = false;
  @Input() textSize = 'normal';
  @Input() showMembership = false;

}
