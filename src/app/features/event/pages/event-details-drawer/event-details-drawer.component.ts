import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventResponse } from 'src/app/core/models/event-response';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { EventComponent } from '../../components/event/event.component';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-event-details-drawer',
  imports: [
    CommonModule, 
    DrawerModule,
    EventComponent
  ],
  templateUrl: './event-details-drawer.component.html',
  styleUrl: './event-details-drawer.component.scss',
})
export class EventDetailsDrawerComponent {

  visible = true;
  eventId: string;
  event: EventResponse | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('eventId')!;
    this.getEventDetails();
  }

  closeDrawer() {
    // Navigate back to parent route
    this.router.navigate(['../../'], { 
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve'
    });
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

