import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Member } from 'src/app/core/models/member';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { MembershipStatusService } from 'src/app/core/services/membership-status.service';
import { MembershipTypeService } from 'src/app/core/services/membership-type.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { RoleService } from 'src/app/core/services/role.service';
import { SessionService } from 'src/app/core/services/session.service';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';
import { ContactDetailsComponent } from 'src/app/shared/components/contact-details/contact-details.component';

@Component({
  selector: 'app-view-member-details',
  imports: [
    CommonModule,
    ContactDetailsComponent,
    MemberDetailsComponent
  ],
  templateUrl: './view-member-details.component.html',
  styleUrl: './view-member-details.component.scss'
})
export class ViewMemberDetailsComponent {

  member: Member | undefined;
  membership: MembershipResponse | undefined;
  organizationId: string | null = null;

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
      this.member = config.data.member;

    }
  }
}
