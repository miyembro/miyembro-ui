import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { EventAttendanceTurnoutComponent } from "../../components/event-attendance-turnout/event-attendance-turnout.component";
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';

@Component({
  selector: 'app-event-attendance-graph-drawer',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    DrawerModule,
    EventFormComponent,
    EventAttendanceTurnoutComponent
],
  templateUrl: './event-attendance-graph-drawer.component.html',
  styleUrl: './event-attendance-graph-drawer.component.scss',
})
export class EventAttendanceGraphDrawerComponent {

  eventId: string | undefined;
  event: EventSummaryResponse | undefined;
  visible = true;

  private routeSub!: Subscription;

  constructor(
    private activatedRoute : ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private location: Location,
    private router: Router,
  ) {
  }


  ngOnInit() {
    this.routeSub = this.activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('eventId')!;
      this.getEventSummaryDetails();
    });
  } 

  closeDrawer() {
    this.router.navigate(['../../'], { 
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve'
    });
  }

  private getEventSummaryDetails() {
    this.loaderService.showLoader(this.router.url, false);
    this.eventService.getEventSummary(this.eventId).subscribe({
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
