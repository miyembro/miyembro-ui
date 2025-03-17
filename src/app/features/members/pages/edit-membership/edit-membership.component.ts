import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MembershipType } from 'src/app/core/models/membership-type';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';
import { MembershipService } from 'src/app/core/services/membership.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MemberFormComponent } from "../../../../core/auth/components/member-form/member-form.component";
import { MembershipFormComponent } from "../../components/membership-form/membership-form.component";
import { RoleService } from 'src/app/core/services/role.service';
import { Role } from 'src/app/core/models/role';
import { MembershipStatusResponse } from '../../../../core/models/membership-status-response';
import { MembershipStatusService } from 'src/app/core/services/membership-status.service';
import { MembershipRequest } from 'src/app/core/models/membership-request';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-edit-membership',
  imports: [
    ButtonModule,
    FloatLabelModule,
    FormsModule,
    MemberDetailsComponent,
    MemberFormComponent,
    MembershipFormComponent,
    ReactiveFormsModule,
    SelectModule
  ],
  templateUrl: './edit-membership.component.html',
  styleUrl: './edit-membership.component.scss'
})
export class EditMembershipComponent implements OnInit {

  membership: MembershipResponse | undefined;
  membershipForm: FormGroup; 
  membershipTypes: MembershipType [] = [];
  membershipStatuses: MembershipStatusResponse [] = [];
  organizationId: string | null = null;
  roles: Role [] = [];

  constructor(
    private config: DynamicDialogConfig, 
    private confirmDialogService: ConfirmDialogService,   
    private formBuilder: FormBuilder,
    private membershipService: MembershipService,
    private membershipStatusService: MembershipStatusService,
    private membershipTypeService: MembershipTypeService,
    private ref: DynamicDialogRef,
    private roleService: RoleService,
    private router: Router,
    private sessionService: SessionService
  ) {
    if (config.data) {
      this.organizationId = config.data.organizationId;
      this.membership = config.data.membership;
    }
    this.membershipForm = this.formBuilder.group({
      membershipId: [null],
      organizationId: [null],
      member: [null],
      membershipType: [null, Validators.required],
      membershipStatus: [null, Validators.required],
      role: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.getMembershipTypes();
    this.getRoles();
    this.getMembershipStatuses();
  }

  onCancelEditMembership() {
    this.ref.close();
  }

  onDeleteMembership(event: Event) {
    const key = this.router.url;
    this.confirmDialogService.warning(
      key,
      "Are you sure you want to remove this member from the organization", 
      "Remove Member", 
      true,
      "Remove Member",
      event,
      () => {
        this.deleteMembership();
      },
      () => {
       console.log('sadas');
      },
    );
  }

  onUpdateMembership() {
    const membership = this.membershipForm.value;
  
    const membershipRequest: MembershipRequest = membership as MembershipRequest;

    const organizationId = this.sessionService.organizationId;
  
    this.membershipService.updateMembershipFromOrganization(organizationId, membershipRequest).subscribe(
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
  
  private deleteMembership() {
    
    const membership = this.membership;
  
    const membershipRequest: MembershipRequest = membership as MembershipRequest;
  
    this.membershipService.deletMembershipFromOrganization(membershipRequest).subscribe(
      (res) => {
        //this.membership = res;
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

  private getRoles() {
    this.roleService.getVisibleRoles().subscribe(
      (res) => {
        this.roles = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private getMembershipStatuses() {
    this.membershipStatusService.getApprovedMembershipStatuses().subscribe(
      (res) => {
        this.membershipStatuses = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
