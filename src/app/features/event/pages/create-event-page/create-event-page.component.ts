import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from "../../components/event-form/event-form.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { startDateBeforeEndDateValidator } from 'src/app/core/validators/start-date-before-end-date-validator';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { dataURLToFile } from 'src/app/core/helpers/data-url-to-file';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-create-event-page',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    EventFormComponent
],
  templateUrl: './create-event-page.component.html',
  styleUrl: './create-event-page.component.scss',
})
export class CreateEventPageComponent implements OnInit {

  eventForm: FormGroup;
  organizationId!: string;
  
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
    const state = navigation?.extras?.state as { organizationId?: string };
    if (state?.organizationId) {
      this.organizationId = state.organizationId;
      this.eventForm.patchValue({
        organizationId: this.organizationId
      });
      console.log(this.organizationId);
    } else {
      this.router.navigate(['**']);
    }
  }

  ngOnInit(): void {
    this.eventForm.get('endEventDate')?.valueChanges.subscribe(() => {
      this.eventForm.get('startEventDate')?.updateValueAndValidity();
    });
  }
  
  createEvent() {
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
    this.eventService.createEvent(this.organizationId, formData).subscribe(
      (res) => {
        console.log(res);
        this.alertService.success(this.router.url, 'Success', "Succesfully created event");
        this.loaderService.hideLoader(this.router.url);
        this.eventForm.enable();
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

  cancelCreateEvent(){
    this.location.back();
  }
  

}
