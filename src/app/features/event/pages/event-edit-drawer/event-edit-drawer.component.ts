import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ActivatedRoute, Router } from '@angular/router';
import { EventResponse } from 'src/app/core/models/event-response';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-edit-drawer',
  imports: [
    CommonModule, 
    DrawerModule,
  ],
  templateUrl: './event-edit-drawer.component.html',
  styleUrl: './event-edit-drawer.component.scss',
})
export class EventEditDrawerComponent implements OnInit, OnDestroy {

  visible = true;
  eventId!: string;
  event: EventResponse | undefined;
  private routeSub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      if (this.eventId) {
        this.getEventDetails();
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  closeDrawer() {
    this.router.navigate(['../../'], { 
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve'
    });
  }

  private getEventDetails() {
    this.loaderService.showLoader(this.router.url, false);
    this.eventService.getEvent(this.eventId).subscribe({
      next: (res) => {
        this.event = res;
        this.loaderService.hideLoader(this.router.url);
      },
      error: (err) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    });
  }
}
