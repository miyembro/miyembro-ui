import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/core/services/session.service';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { OrganizationService } from '../../../../core/services/organization.service';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrganizationComponent } from '../../components/organization/organization.component';
import { GetMembershipRequest } from 'src/app/core/models/get-membership-request';
import { MembershipService } from 'src/app/core/services/membership.service';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-organization',
  imports: [
    AvatarGroupModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    OrganizationComponent
  ],
  templateUrl: './my-organization.component.html',
  styleUrl: './my-organization.component.scss'
})
export class MyOrganizationComponent implements OnInit{

  loginErrorMessage: string | null = null;
  membership: MembershipResponse | null = null;
  organization: OrganizationResponse | null = null;

  constructor(
      private organizationService: OrganizationService,
      private membershipService: MembershipService,
      private sessionService: SessionService,
  ) {
    
  }


  ngOnInit(): void {
    this.getOrganization();
    this.organizationService.getOrganizationUpdate().subscribe((res) => {
      if(res) {
        this.organization = res;
      }
    });
  }

  private getOrganization() {
    let organizationId;
    if(this.sessionService.getSession()?.organization?.organizationId) {
      organizationId = this.sessionService.getSession()?.organization?.organizationId;
    }
    this.organizationService.getMyOrganizationById(organizationId).subscribe(
      (res) => {
        this.organization = res;
        this.getMembershipByMemberIdAndOrganizationId(this.organization);
      },
      (err: any) => {
        this.loginErrorMessage = err.error.message;
      }
    );
  }

  private getMembershipByMemberIdAndOrganizationId(organization: OrganizationResponse | null) {
      const session = this.sessionService.getSession();
      const getMembershipRequest: GetMembershipRequest = {
        organizationId: organization?.organizationId,
        memberId: session?.member.memberId
      };
  
      this.membershipService.getMembershipByMemberIdAndOrganizationId(organization?.organizationId, session?.member.memberId).subscribe(
        (res) => {
          this.membership = res;
        },
        (err: any) => {
          this.loginErrorMessage = err.error.message;
        }
      );
    }




}

