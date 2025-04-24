import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from 'src/app/core/models/event-response';
import { CardModule } from 'primeng/card';
import { EventDateRangePipe } from 'src/app/shared/pipes/event-date-range.pipe';
import { TagModule } from 'primeng/tag';
import { HasAddressPipe } from "../../../../shared/pipes/has-address.pipe";
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup'; 
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventConfirmationService } from 'src/app/core/services/event-confirmation.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventConfirmationResponse } from 'src/app/core/models/event-confirmation-response';
import { SessionService } from 'src/app/core/services/session.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { EventConfirmationRequest } from 'src/app/core/models/event-confirmation-request';
import { EventConfirmationSelectButtonComponent } from '../event-confirmation-select-button/event-confirmation-select-button.component';
import { EventSkeletonComponent } from "../event-skeleton/event-skeleton.component";

@Component({
  selector: 'app-event',
  imports: [
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    CommonModule,
    EventConfirmationSelectButtonComponent,
    EventDateRangePipe,
    FormsModule,
    HasAddressPipe,
    SelectButtonModule,
    TagModule,
    EventSkeletonComponent
],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent implements OnInit, OnChanges{

  @Input() event: EventResponse | undefined;
  @Input() isVerticalAlign = false;

  eventConfirmationResponse: EventConfirmationResponse | undefined;
  eventConfirmationStatus: EventConfirmationStatus | undefined;
  eventConfirmationStatuses: any [] = [];
  loading = true;

  EventConfirmationStatus = EventConfirmationStatus;

  constructor(
    private alertService: AlertService,
    private eventConfirmationService: EventConfirmationService,
    private loaderService: LoaderService,
    private router: Router,
    private sessionService: SessionService
  ) {
  }

  ngOnInit(): void {
    this.eventConfirmationStatuses = [
      { 
        label: 'Going', 
        value: EventConfirmationStatus.YES,
        icon: 'pi pi-check', 
      },
      { 
        label: 'Nope', 
        value: EventConfirmationStatus.NO,
        icon: 'pi pi-times',
      },
      { 
        label: 'Maybe', 
        value: EventConfirmationStatus.MAYBE ,
        icon: 'pi pi-question',
      }
    ]
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      this.getEventConfirmation();
    }
  }

  getEventConfirmation() {
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.event?.eventId;
    const organizationId = this.event?.organizationId;

    const memberId = this.sessionService.getSession()?.member.memberId;

    this.eventConfirmationService.getEventConfirmation(organizationId, eventId, memberId).subscribe(
      (res) => {
        this.eventConfirmationResponse = res;
        if(this.eventConfirmationResponse) {
          this.eventConfirmationStatus = this.eventConfirmationResponse.eventConfirmationStatus;
        }
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  confirmAttendance(eventConfirmationStatus: any) {
    if(this.eventConfirmationResponse) {
      this.updateEventConfirmation(this.eventConfirmationStatus)
    } else {
      this.createEventAttendance();
    }
  }

  private createEventAttendance() {
    this.loaderService.showLoader(this.router.url, false);
    const eventId = this.event?.eventId;

    const memberId = this.sessionService.getSession()?.member.memberId;

    const eventAttendanceRequest: EventConfirmationRequest = {
      eventConfirmationId: null,
      eventId: eventId,
      memberId: memberId,
      eventConfirmationStatus: this.eventConfirmationStatus
    }

    this.eventConfirmationService.createEventConfirmation(memberId, eventId, eventAttendanceRequest).subscribe(
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


  private updateEventConfirmation(eventConfirmationStatus: EventConfirmationStatus | undefined) {
    this.loaderService.showLoader(this.router.url, false);

    const memberId = this.sessionService.getSession()?.member.memberId;

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
  
}