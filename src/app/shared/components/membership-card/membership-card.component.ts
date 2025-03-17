import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { Member } from 'src/app/core/models/member';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';

@Component({
  selector: 'app-membership-card',
  imports: [AvatarModule, CardModule, CommonModule],
  templateUrl: './membership-card.component.html',
  styleUrl: './membership-card.component.scss'
})
export class MembershipCardComponent {
  
  @Input() member: Member | undefined;
  @Input() membership: MembershipResponse | null = null;
  @Input() organization: OrganizationResponse | null = null;
 

}
