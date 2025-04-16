import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { ActivatedRoute, Router } from '@angular/router';
import { EventResponse } from 'src/app/core/models/event-response';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { EventFormType } from 'src/app/core/models/event-form-type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { startDateBeforeEndDateValidator } from 'src/app/core/validators/start-date-before-end-date-validator';

@Component({
  selector: 'app-event-edit-drawer',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    DrawerModule,
    EventFormComponent
  ],
  templateUrl: './event-edit-drawer.component.html',
  styleUrl: './event-edit-drawer.component.scss',
})
export class EventEditDrawerComponent implements OnInit, OnDestroy {

  event: EventResponse | undefined;
  eventForm: FormGroup;
  eventId!: string;
  visible = true;

  EventFormType = EventFormType;
  
  private routeSub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private location: Location,
    private router: Router
  ) {
    this.eventForm = this.formBuilder.group({
      eventId: [null],
      organizationId: [null],
      name: ['', Validators.required],
      description: ['', [emptyEditorValidator(), Validators.required]],
      eventPicUrl: [null],
      isOnline: [false],
      startEventDate: ['', [startDateBeforeEndDateValidator('endEventDate'), Validators.required]],
      endEventDate: [''],
      eventAddress: this.formBuilder.group({
        eventAddressId: [null],
        street: [null],
        city: [null],
        provinceState: [null],
        postalCode: [null],
        country: [null]
      })
    });
  }

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

  cancelUpdateEvent(){
    this.location.back();
  }

  closeDrawer() {
    this.router.navigate(['../../'], { 
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve'
    });
  }

  deleteEvent() {
    this.loaderService.showLoader(this.router.url, false);

    this.eventService.deleteEventByOrganization(this.event?.organizationId, this.eventId).subscribe(
      (res) => {
        console.log(res);
        this.alertService.success(this.router.url, 'Success', "Succesfully deleted event");
        this.loaderService.hideLoader(this.router.url);
        this.eventForm.enable();
        this.eventService.notifyEventUpdated(); 
        this.location.back();
      },
      (err: any) => {
        this.eventForm.enable();
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  editEvent() {
    this.loaderService.showLoader(this.router.url, false);

    const eventRequest = { ...this.eventForm.value };

    if(eventRequest.isOnline) {
      eventRequest.eventAddress = null;
    }

    const address = eventRequest.eventAddress;
    if (address) {
      const { eventAddressId, ...addressFields } = address;
      const allFieldsNull = Object.values(addressFields).every(val => val === null);
      if (allFieldsNull) {
        eventRequest.eventAddress = null;
      }
    }
    

    const formData = new FormData();

    if(eventRequest.eventPicUrl) {
      const eventPicUrlImage: File = this.eventForm.controls['eventPicUrl'].value;
      formData.append('eventPicUrlImage', eventPicUrlImage);
      eventRequest.eventPicUrl = null;
    }

    const jsonBlob = new Blob([JSON.stringify(eventRequest)], { type: 'application/json' });

    formData.append('eventRequest', jsonBlob);

    this.eventForm.disable();
    this.eventService.updateEvent(this.event?.organizationId, this.eventId, formData).subscribe(
      (res) => {
        console.log(res);
        this.alertService.success(this.router.url, 'Success', "Succesfully updated event");
        this.loaderService.hideLoader(this.router.url);
        this.eventForm.enable();
        this.eventService.notifyEventUpdated(); 
        if (this.event?.eventPicUrl) {
          this.event.eventPicUrl += '?v=' + Date.now();
        }
        this.location.back();
      },
      (err: any) => {
        console.log(err);
        this.eventForm.enable();
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
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
