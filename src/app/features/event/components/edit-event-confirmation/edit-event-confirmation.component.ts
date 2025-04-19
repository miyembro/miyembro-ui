import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipResponse } from 'src/app/core/models/membership-response';
import { MemberDetailsComponent } from 'src/app/features/home/components/member-details/member-details.component';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventConfirmationSelectButtonComponent } from '../event-confirmation-select-button/event-confirmation-select-button.component';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { EventConfirmationRequest } from 'src/app/core/models/event-confirmation-request';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-edit-event-confirmation',
  imports: [
    CommonModule,
    EventConfirmationSelectButtonComponent,
    MemberDetailsComponent,
  ],
  templateUrl: './edit-event-confirmation.component.html',
  styleUrl: './edit-event-confirmation.component.scss',
})
export class EditEventConfirmationComponent implements OnInit {

  eventConfirmationId!: string;
  eventConfirmationResponse: EventConfirmationResponse | undefined;
  eventConfirmationStatus: EventConfirmationStatus | undefined;
  eventId!: string;
  memberId!: string;
  membership: MembershipResponse | undefined;
  organizationId!: string;

  constructor(
    private alertService: AlertService,
    private config: DynamicDialogConfig, 
    private confirmDialogService: ConfirmDialogService,   
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private membershipService: MembershipService,
    private router: Router
  ) {
    if (config.data) {
      this.eventConfirmationId = config.data.eventConfirmationId;
      this.eventId = config.data.eventId;
      this.memberId = config.data.memberId;
      this.organizationId = config.data.organizationId;
      this.getMembershipDetails();
      this.getEventConfirmationDetails();
    }
  }

  ngOnInit(): void {
    this.getMembershipDetails();
    this.getEventConfirmationDetails();
  }

  updateEventConfirmation(eventConfirmationStatus: EventConfirmationStatus | undefined) {
    this.loaderService.showLoader(this.router.url, false);

    const memberId = this.memberId;

    const eventConfirmationRequest: EventConfirmationRequest = {
      eventConfirmationId: this.eventConfirmationResponse?.eventConfirmationId,
      eventId: this.eventConfirmationResponse?.eventId,
      memberId: this.eventConfirmationResponse?.memberId,
      eventConfirmationStatus: eventConfirmationStatus
    }


    this.eventConfirmationService.updateEventConfirmation(memberId, this.eventConfirmationResponse?.eventConfirmationId, eventConfirmationRequest).subscribe(
      (res) => {
        this.eventConfirmationResponse = res;
        this.eventConfirmationStatus = this.eventConfirmationResponse.eventConfirmationStatus;
        this.eventConfirmationService.notifyEventConfirmationUpdated();
        this.alertService.success(this.router.url, 'Success', "Attendance succesfully sent");
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  private getEventConfirmationDetails() {
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.eventId;
    const organizationId = this.organizationId;
    const memberId = this.memberId;

    this.eventConfirmationService.getEventConfirmation(organizationId, eventId, memberId).subscribe(
      (res) => {
        this.eventConfirmationResponse = res;
        if(this.eventConfirmationResponse) {
          this.eventConfirmationStatus = this.eventConfirmationResponse.eventConfirmationStatus;
        }
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }


  private getMembershipDetails() {
    this.loaderService.showLoader(this.router.url, false);
    this.membershipService.getMembershipByMemberIdAndOrganizationId(this.organizationId, this.memberId).subscribe(
      (res) => {
        this.membership = res;
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.error('Error:', err); 
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }



}
