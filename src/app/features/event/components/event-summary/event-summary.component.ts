import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventResponse } from 'src/app/core/models/event-response';
import { EventDateRangePipe } from "../../../../shared/pipes/event-date-range.pipe";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-event-summary',
  imports: [
    ButtonModule,
    CommonModule, 
    EventDateRangePipe
  ],
  templateUrl: './event-summary.component.html',
  styleUrl: './event-summary.component.scss',
})
export class EventSummaryComponent implements OnChanges {

  @Input() eventId: string | undefined;

  event: EventResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private loaderService: LoaderService,
    private router: Router
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && this.eventId) {
      this.getEventDetails();
    }
  }

  onViewEventDetails(row: any) {
    this.router.navigate(['view', this.eventId], { relativeTo: this.activatedRoute });
  }

  private getEventDetails() {
    this.loaderService.showLoader(this.router.url, false);
    this.eventService.getEvent(this.eventId).subscribe({
      next: (res) => {
        this.event = res;
        if (this.event?.eventPicUrl) {
          this.event.eventPicUrl += '?v=' + Date.now();
        }
        this.loaderService.hideLoader(this.router.url);
      },
      error: (err) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    });
  }
  
}
