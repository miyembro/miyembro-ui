import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { EventResponse } from 'src/app/core/models/event-response';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { MembershipService } from 'src/app/core/services/membership.service';
import { SessionService } from 'src/app/core/services/session.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventItemGridComponent } from '../event-item-grid/event-item-grid.component';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';

@Component({
  selector: 'app-event-list',
  imports: [
    ButtonModule,
    CommonModule,
    DataViewModule,
    EventItemGridComponent,
    FormsModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit, OnChanges{

  @Input() organizationId: string | undefined;

  events: EventSummaryResponse [] = [];

  constructor(
    private alertService: AlertService,
    private eventService: EventService,
    private loaderService: LoaderService,
    private router: Router,
  ) {
    
  }

  ngOnInit(): void {
    console.log('event list');
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organizationId'] && this.organizationId) {
      this.loadEvents();
    }
  }

  private loadEvents() {
    this.loaderService.showLoader(this.router.url, false);

    this.eventService.getEventsByOrganizationId(this.organizationId).subscribe(
      (res) => {
       console.log(res);
       this.events = res;
       this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.log(err);
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  onClickEvent(event: EventSummaryResponse | undefined) {
    this.router.navigate(['/home/event-details'], {
      state: { eventId: event?.eventId }
    });
  }

}
