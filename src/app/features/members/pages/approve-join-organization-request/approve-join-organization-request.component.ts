import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig,  DynamicDialogRef } from 'primeng/dynamicdialog';
import { MembershipType } from 'src/app/core/models/membership-type';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MembershipRequest } from 'src/app/core/models/membership-request';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-approve-join-organization-request',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    MemberDetailsComponent,
    ReactiveFormsModule,
    SelectModule
  ],
  templateUrl: './approve-join-organization-request.component.html',
  styleUrl: './approve-join-organization-request.component.scss'
})
export class ApproveJoinOrganizationRequestComponent implements OnInit {

  membership: MembershipResponse | undefined;
  membershipTypes: MembershipType [] = [];
  organizationId: string | null = null;
  selectedMembership: MembershipType | undefined;

  constructor(
    public config: DynamicDialogConfig,    
    private membershipService: MembershipService,
    private membershipTypeService: MembershipTypeService,
    private ref: DynamicDialogRef,
    private sessionService: SessionService
  ) {
    if (config.data) {
      this.organizationId = config.data.organizationId;
      this.membership = config.data.membership;
    }
  }

  ngOnInit(): void {
    this.getMembershipTypes();
  }

  approveJoinRequest() {
    if (this.membership) {
      this.membership.membershipType = this.selectedMembership;
    }
  
    const { role, ...membershipToUpdate } = { ...this.membership };
  
    const membershipRequest: MembershipRequest = membershipToUpdate as MembershipRequest;
    const organizationId = this.sessionService.organizationId;
  
    this.membershipService.approveMembershipRequest(organizationId, membershipRequest).subscribe(
      (res) => {
        this.membership = res;
        this.ref.close({
          membership: this.membership
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  cancelApproveJoinRequest() {
   this.ref.close();
  }

  denyJoinRequest() {
    if (this.membership) {
      this.membership.membershipType = this.selectedMembership;
    }
  
    const { role, ...membershipToUpdate } = { ...this.membership };
  
    const membershipRequest: MembershipRequest = membershipToUpdate as MembershipRequest;
    const organizationId = this.sessionService.organizationId;

  
    this.membershipService.denyMembershipRequest(organizationId, membershipRequest).subscribe(
      (res) => {
        this.membership = res;
        this.ref.close({
          membership: this.membership
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
    
  private getMembershipTypes() {
    this.membershipTypeService.getMembershipTypesByOrganizationId(this.organizationId).subscribe(
      (res) => {
        this.membershipTypes = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
