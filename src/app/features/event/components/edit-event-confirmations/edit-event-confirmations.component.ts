import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MembershipsSummaryListComponent } from 'src/app/shared/components/memberships-summary-list/memberships-summary-list.component';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { MembershipFilters } from 'src/app/core/models/membership-filters';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { EventConfirmationSelectButtonComponent } from '../event-confirmation-select-button/event-confirmation-select-button.component';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { EventConfirmationFilters } from 'src/app/core/models/event-confirmation-filters';
import { EventConfirmationRequest } from 'src/app/core/models/event-confirmation-request';

@Component({
  selector: 'app-edit-event-confirmations',
  imports: [
    ButtonModule,
    CommonModule,
    EventConfirmationSelectButtonComponent,
    MembershipsSummaryListComponent
  ],
  templateUrl: './edit-event-confirmations.component.html',
  styleUrl: './edit-event-confirmations.component.scss',
})
export class EditEventConfirmationsComponent {

  eventConfirmations: EventConfirmationResponse [] = [];
  eventConfirmationIds: (string | undefined) [] = [];
  eventConfirmationStatus: EventConfirmationStatus | undefined;
  eventId!: string;
  memberIds: string [] = [];
  memberships: MembershipResponse [] = [];
  organizationId!: string;

  constructor(
    private alertService: AlertService,
    private config: DynamicDialogConfig, 
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private ref: DynamicDialogRef,
    private membershipService: MembershipService,
    private router: Router
  ) {
    if (config.data) {
      this.eventId = config.data.eventId;
      this.organizationId = config.data.organizationId;
      this.eventConfirmationIds = config.data.eventConfirmationIds;
      this.memberIds = config.data.memberIds;
      this.getMembershipsDetails();
      this.getEventConfirmationDetails();
    }
  }


  onCreateEventAttendances() {
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.eventId;
    const memberIds = this.memberIds;

    const eventAttendanceRequests: EventConfirmationRequest[] = memberIds.map(memberId => ({
      eventConfirmationId: null, 
      eventId: eventId,
      memberId: memberId,
      eventConfirmationStatus: this.eventConfirmationStatus
    }));


    this.eventConfirmationService.createEventConfirmations(eventId, eventAttendanceRequests).subscribe(
      (res) => {
        this.eventConfirmations = res;
        console.log(this.eventConfirmations);
        this.eventConfirmationService.notifyEventConfirmationUpdated();
        this.onCancelEditEventConfirmation();
        this.alertService.success(this.router.url, 'Success', "Attendance succesfully sent");
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  onUpdateEventConfirmations() {
    const eventConfirmations: EventConfirmationResponse [] = this.eventConfirmations;
    eventConfirmations.forEach(ec => {
      ec.eventConfirmationStatus = this.eventConfirmationStatus;
    });
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.eventId;
    
    this.eventConfirmationService.updateEventConfirmations(eventId, eventConfirmations).subscribe(
      (res) => {
        this.eventConfirmations = res;
        console.log(this.eventConfirmations);
        this.eventConfirmationService.notifyEventConfirmationUpdated();
        this.onCancelEditEventConfirmation();
        this.alertService.success(this.router.url, 'Success', "Successfully updated attendances");

        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  onCancelEditEventConfirmation() {
    this.ref.close();
  }

  private getEventConfirmationDetails() {
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.eventId;
    const organizationId = this.organizationId;

    const eventConfirmationFilters = {} as EventConfirmationFilters;
    eventConfirmationFilters.memberIds = this.memberIds;
    
    this.eventConfirmationService.getEventConfirmations(eventId, null, null, 'eventConfirmationId', 'ASC',  eventConfirmationFilters).subscribe(
      (res) => {
        this.eventConfirmations = res.content;
        console.log(this.eventConfirmations);
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  private getMembershipsDetails() {
    this.loaderService.showLoader(this.router.url, false);
    const membershipFilters = {} as MembershipFilters;
    membershipFilters.memberIds = this.memberIds;
    
    this.membershipService.getMembershipsByOrganization(this.organizationId, null, null, 'member.firstName', 'ASC', membershipFilters).subscribe(
      (res) => {
        console.log(res);
        this.memberships = res.content;
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.log('Error:', err); 
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }
}
