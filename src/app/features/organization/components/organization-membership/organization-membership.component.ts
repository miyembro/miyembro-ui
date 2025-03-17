import { Component, Input, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MembershipCardComponent } from 'src/app/shared/components/membership-card/membership-card.component';
import { SessionService } from 'src/app/core/services/session.service';
import { Member } from 'src/app/core/models/member';

@Component({
  selector: 'app-organization-membership',
  imports: [
    AvatarModule,
    CardModule,
    CommonModule,
    MembershipCardComponent
  ],
  templateUrl: './organization-membership.component.html',
  styleUrl: './organization-membership.component.scss'
})
export class OrganizationMembershipComponent implements OnInit {

  @Input() organization: OrganizationResponse | null = null;
  @Input() membership: MembershipResponse | null = null;
  member: Member | undefined;

  constructor(
    private sessionService: SessionService
  ) {
    
  }
  ngOnInit(): void {
    this.member = this.sessionService.getSession()?.member;
  }

}
