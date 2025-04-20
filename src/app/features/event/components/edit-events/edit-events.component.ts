import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { ButtonModule } from 'primeng/button';
import { EventsSummaryListComponent } from "../events-summary-list/events-summary-list.component";
import { EventResponse } from 'src/app/core/models/event-response';
import { ConfirmDialogService } from 'src/app/core/services/confirm-dialog.service';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';
import { EventFilters } from 'src/app/core/models/event-filters';

@Component({
  selector: 'app-edit-events',
  imports: [
    ButtonModule,
    CommonModule,
    EventsSummaryListComponent
],
  templateUrl: './edit-events.component.html',
  styleUrl: './edit-events.component.scss',
})
export class EditEventsComponent {

  eventIds: string [] =[];
  organizationId!: string;
  events: EventSummaryResponse [] = [];

  constructor(
    private alertService : AlertService,
    private config: DynamicDialogConfig, 
    private confirmDialogService: ConfirmDialogService,   
    private eventService: EventService,
    private loaderService: LoaderService,
    private ref: DynamicDialogRef,
    private router: Router,
  ) {
    if (config.data) {
      this.organizationId = config.data.organizationId;
      this.eventIds = config.data.eventIds;
      this.getEvents();
    }
  }

  onCancelEditEvents() {
    this.ref.close();
  }

  onDeleteEvents(event: any) {
    const key = this.router.url;
    this.confirmDialogService.warning(
      key,
      "Are you sure you want to delete these events", 
      "Delete Events", 
      true,
      "Delete Events",
      event,
      () => {
        this.deleteEvents();
      },
      () => {
       console.log('sadas');
      },
    );
  }

  private deleteEvents() {
    const organizationId = this.organizationId;
    const eventIds = this.eventIds;

    this.eventService.deleteEventsByOrganization(organizationId, eventIds).subscribe(
      (res) => {
        this.eventService.notifyEventUpdated(); 
        this.onCancelEditEvents();
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
      }
    );
  }

  private getEvents() {
    this.loaderService.showLoader(this.router.url, false);
    const filters = {} as EventFilters;
    filters.eventIds = this.eventIds;
    this.eventService.getEventsByOrganizationIdPage(this.organizationId, null, null, 'eventId', 'ASC', filters).subscribe(
      (res) => {
        this.events = res.content;
        console.log(this.events);
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.log(err);
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }


}
