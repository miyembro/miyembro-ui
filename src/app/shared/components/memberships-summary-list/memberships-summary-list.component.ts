import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';

@Component({
  selector: 'app-memberships-summary-list',
  imports: [
    CommonModule,
    ListboxModule,
    MemberDetailsComponent
  ],
  templateUrl: './memberships-summary-list.component.html',
  styleUrl: './memberships-summary-list.component.scss',
})
export class MembershipsSummaryListComponent {

  @Input() memberships: MembershipResponse [] = [];
  
}
