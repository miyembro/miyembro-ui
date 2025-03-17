import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { MembershipFormType } from 'src/app/core/models/membership-form-type.enum';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MembershipType } from 'src/app/core/models/membership-type';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { FormErrorsFilterPipe } from 'src/app/shared/pipes/form-errors-filter.pipe';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { Role } from 'src/app/core/models/role';
import { DatePickerModule } from 'primeng/datepicker';
import { MembershipStatusResponse } from '../../../../core/models/membership-status-response';

@Component({
  selector: 'app-membership-form',
  imports: [
    CommonModule,
    DatePickerModule,
    FloatLabelModule,
    FormErrorsFilterPipe,
    FormErrorsPipe,
    FormsModule,
    IftaLabelModule,
    ReactiveFormsModule,
    SelectModule,
    TooltipModule
  ],
  templateUrl: './membership-form.component.html',
  styleUrl: './membership-form.component.scss'
})
export class MembershipFormComponent implements OnChanges {

  @Input() formType: MembershipFormType = MembershipFormType.UPDATE_MEMBERSHIP;
  @Input() membership: MembershipResponse | undefined;
  @Input() membershipForm: FormGroup = new FormGroup({}); 
  @Output() memberFormChange = new EventEmitter<FormGroup>(); 
  @Input() membershipTypes: MembershipType  [] = [];
  @Input() membershipStatuses: MembershipStatusResponse  [] = [];
  @Input() roles: Role  [] = [];

  MembershipFormType = MembershipFormType;

  get f(): { [key: string]: AbstractControl } {
    return this.membershipForm.controls;
  }

  get fgErrors(): { [key: string]: ValidationErrors } | null {
    return this.membershipForm.errors;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['membership'] && this.membership) {
      this.patchForm();
    }
    if (changes['membershipTypes'] && this.membershipTypes) {
      this.patchMembershipType();
    }
    if (changes['roles'] && this.roles) {
      this.patchRole();
    }
    if (changes['membershipStatuses'] && this.membershipStatuses) {
      this.patchMembershipStatuses();
    }
  }
 
  private patchForm() {
    if (this.membershipForm) {
      this.membershipForm.patchValue({
        membershipId: this.membership?.membershipId,
        organizationId: this.membership?.organizationId,
        member: this.membership?.member,
        membershipType: this.membership?.membershipType,
        membershipStatus: this.membership?.membershipStatus,
        role: this.membership?.role,
        startDate: this.membership?.startDate ? new Date(this.membership.startDate) : null,
        endDate:  this.membership?.endDate ? new Date(this.membership.endDate) : null
      });
      this.setFormToPristine();
    }
  }

  private patchMembershipStatuses() {
    if(this.membershipStatuses) {
      const membershipStatus = this.membershipStatuses.find( membershipStatus => membershipStatus.membershipStatusId === this.membership?.membershipStatus?.membershipStatusId);
      this.membershipForm.patchValue({
        membershipStatus : membershipStatus
      });
      this.setFormToPristine();
    }
  }

  private patchMembershipType() {
    if(this.membershipTypes) {
      const membershipType = this.membershipTypes.find( membershipType => membershipType.membershipTypeId === this.membership?.membershipType?.membershipTypeId);
      this.membershipForm.patchValue({
        membershipType : membershipType
      });
      this.setFormToPristine();
    }
  }


  private patchRole() {
    if(this.roles) {
      const role = this.roles.find( role => role.roleId === this.membership?.role?.roleId);
      this.membershipForm.patchValue({
        role : role
      });
      this.setFormToPristine();
    }
  }

  private setFormToPristine() {
    this.membershipForm.markAsPristine();
  }
  
}
