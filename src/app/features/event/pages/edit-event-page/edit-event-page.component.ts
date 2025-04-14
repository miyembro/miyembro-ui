import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { startDateBeforeEndDateValidator } from 'src/app/core/validators/start-date-before-end-date-validator';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { EventResponse } from 'src/app/core/models/event-response';
import { EventFormType } from 'src/app/core/models/event-form-type';

@Component({
  selector: 'app-edit-event-page',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    EventFormComponent
  ],
  templateUrl: './edit-event-page.component.html',
  styleUrl: './edit-event-page.component.scss',
})
export class EditEventPageComponent {

  event: EventResponse | undefined;
  eventForm: FormGroup;
  eventId!: string;
  organizationId!: string;
  EventFormType = EventFormType;
  

  constructor(
    private activatedRoute : ActivatedRoute, 
    private alertService: AlertService,
    private eventService: EventService, 
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private location: Location,
    private router: Router,
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
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { organizationId?: string, eventId?: string };
    if (state?.organizationId && state?.eventId) {
      this.organizationId = state.organizationId;
      this.eventId = state.eventId;
      this.getEventDetails();
    } else {
      this.router.navigate(['**']);
    }
  }

  editEvent() {
    this.loaderService.showLoader(this.router.url, false);

    console.log(this.organizationId);
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
    // this.eventService.createEvent(this.organizationId, formData).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.alertService.success(this.router.url, 'Success', "Succesfully created event");
    //     this.loaderService.hideLoader(this.router.url);
    //     this.eventForm.enable();
    //     this.location.back();
    //   },
    //   (err: any) => {
    //     console.log(err);
    //     this.eventForm.enable();
    //     this.loaderService.hideLoader(this.router.url);
    //     this.alertService.error(this.router.url, 'Error', err.error.message);
    //   }
    // );
  }

  cancelCreateEvent(){
    this.location.back();
  }


  private getEventDetails() {
    this.eventService.getEvent(this.eventId).subscribe(
      (res) => {
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
