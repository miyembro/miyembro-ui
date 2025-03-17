import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MembershipType } from 'src/app/core/models/membership-type';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';
import { ListboxModule } from 'primeng/listbox';
import { AlertService } from 'src/app/core/services/alert.service';
import { MembershipRequest } from 'src/app/core/models/membership-request';
import { SessionService } from 'src/app/core/services/session.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { ApproveMembershipsRequest } from 'src/app/core/models/approve-memberships-request';
import { DenyMembershipsRequest } from 'src/app/core/models/deny-memberships-request';

@Component({
  selector: 'app-approve-multiple-join-organization-requests',
  imports: [
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ListboxModule,
    MemberDetailsComponent,
    ReactiveFormsModule,
    SelectModule
  ],
  templateUrl: './approve-multiple-join-organization-requests.component.html',
  styleUrl: './approve-multiple-join-organization-requests.component.scss'
})
export class ApproveMultipleJoinOrganizationRequestsComponent implements OnInit {

  memberships: MembershipResponse [] = [];
  membershipTypes: MembershipType [] = [];
  organizationId: string | null = null;
  selectedMembershipType: MembershipType | undefined;

  constructor(
    private alertService: AlertService,
    public config: DynamicDialogConfig,    
    private confirmDialogService: ConfirmDialogService,   
    private membershipService: MembershipService,
    private membershipTypeService: MembershipTypeService,
    private ref: DynamicDialogRef,
    private router: Router,
    private sessionService: SessionService
  ) {
    if (config.data) {
      this.organizationId = config.data.organizationId;
      this.memberships = config.data.memberships;
    }
  }

  ngOnInit(): void {
    this.getMembershipTypes();
  }

  onApproveJoinRequests() {
    const organizationId = this.sessionService.organizationId;
    const membershipRequests: MembershipRequest[] = this.memberships.map(m => m as MembershipRequest);

    const approveMembershipsRequest: ApproveMembershipsRequest = {
      membershipType: this.selectedMembershipType,
      organizationId: organizationId,
      membershipRequests: membershipRequests
    }
    
    this.membershipService.approveMembershipRequests(organizationId, approveMembershipsRequest).subscribe(
      (res) => {
        this.memberships = res;
        this.ref.close({
          memberships: this.memberships
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  
  onCancelApproveJoinRequests() {
    this.ref.close();
  }

  onDeleteJoinRequests(event: Event) {
    const key = this.router.url;
    this.confirmDialogService.warning(
      key,
      "Are you sure you want to remove these requests", 
      "Remove Requests", 
      true,
      "Remove Requests",
      event,
      () => {
        this.deleteJoinRequests();
      },
      () => {
        console.log('sadas');
      },
    );
  }
  
  
  onDenyJoinRequests() {
    const organizationId = this.sessionService.organizationId;
    const membershipRequests: MembershipRequest[] = this.memberships.map(m => m as MembershipRequest);

    const denyMembershipsRequest: DenyMembershipsRequest = {
      organizationId: organizationId,
      membershipRequests: membershipRequests
    }

    this.membershipService.denyMembershipRequests(organizationId, denyMembershipsRequest).subscribe(
      (res) => {
        this.memberships = res;
        this.ref.close({
          memberships: this.memberships
        });
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private deleteJoinRequests() {
    const organizationId = this.sessionService.organizationId;
    const membershipRequests: MembershipRequest[] = this.memberships.map(m => m as MembershipRequest);
  
    this.membershipService.deleteMembershipRequests(organizationId, membershipRequests).subscribe(
      (res) => {
        this.alertService.success(this.router.url, 'Success', "Succesfully deleted requests");
        this.ref.close({
          memberships: this.memberships
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
