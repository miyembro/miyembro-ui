import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../../core/services/organization.service';
import { OrganizationResponse } from 'src/app/core/models/organization-reponse';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MembershipService } from 'src/app/core/services/membership.service';
import { GetMembershipRequest } from 'src/app/core/models/get-membership-request';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { SessionService } from 'src/app/core/services/session.service';
import { JoinOrganizationRequest } from 'src/app/core/models/join-membership-request';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { OrganizationComponent } from '../../components/organization/organization.component';

@Component({
  selector: 'app-organization-details-page',
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    OrganizationComponent,
    TabsModule
  ],
  templateUrl: './organization-details-page.component.html',
  styleUrl: './organization-details-page.component.scss',
})
export class OrganizationDetailsPageComponent implements OnInit {
  
  loading = false;
  loginErrorMessage: string | null = null;
  membership: MembershipResponse | null = null;
  organization: OrganizationResponse | null = null;
  organizationId: string | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private membershipService: MembershipService,
    private organizationService: OrganizationService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    this.organizationId = this.activatedRoute.snapshot.paramMap.get('organizationId');
    this.getOrganization();
  }

  joinOrganization() {
    const session = this.sessionService.getSession();
    const joinOrganizationRequest: JoinOrganizationRequest = {
      organizationId: this.organization?.organizationId,
      memberId: session?.member.memberId
    };

    this.membershipService.requestMembership(joinOrganizationRequest).subscribe(
      (res) => {
        this.alertService.success('/home/explore', 'Success', 'Successfully sent the request to join the group');
        this.membership = res;
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


  private getOrganization() {
    this.organizationService.getMyOrganizationById(this.organizationId).subscribe(
      (res) => {
        this.organization = res;
        this.getMembershipByMemberIdAndOrganizationId(this.organization);
      },
      (err: any) => {
        this.loading = false;
        this.loginErrorMessage = err.error.message;
      }
    );
  }

}
