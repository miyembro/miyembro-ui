import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { EventComponent } from "../../components/event/event.component";
import { EventResponse } from 'src/app/core/models/event-response';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-event-details-page',
  imports: [
    CommonModule, 
    EventComponent
  ],
  templateUrl: './event-details-page.component.html',
  styleUrl: './event-details-page.component.scss',
})
export class EventDetailsPageComponent {


  eventId!: string;
  event: EventResponse | undefined;


  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private location: Location,
    private eventService: EventService, 
    private router: Router
  ) {

  }

  ngOnInit(): void {
    const state = this.location.getState() as { eventId?: string};
    if (state && state.eventId) {
      this.eventId = state.eventId;
      this.getEventDetails();
    }
  }


  private getEventDetails() {
    this.eventService.getEvent(this.eventId).subscribe(
      (res) => {
        console.log('event', res);
        this.event = res;
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
