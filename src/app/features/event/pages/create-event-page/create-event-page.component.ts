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
import { Router } from '@angular/router';
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
  
  constructor(
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
      eventPicUrl: [''],
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

  ngOnInit(): void {
    this.eventForm.get('endEventDate')?.valueChanges.subscribe(() => {
      this.eventForm.get('startEventDate')?.updateValueAndValidity();
    });    
  }
  
  createEvent(){
    const organizationId = 'a7d1b9d0-56e8-45f6-b418-5f52960b25ab';

    const eventRequest = { ...this.eventForm.value };

    const formData = new FormData();

    if(eventRequest.eventPicUrl) {
      const eventPicUrlImage: File = this.eventForm.controls['eventPicUrl'].value;
      formData.append('eventPicUrlImage', eventPicUrlImage);
      eventRequest.eventPicUrl = '';
    }

     const jsonBlob = new Blob([JSON.stringify(eventRequest)], { type: 'application/json' });

     formData.append('eventRequest', jsonBlob);


    this.eventService.createEvent(organizationId, formData).subscribe(
      (res) => {
        this.alertService.success(this.router.url, 'Success', "Succesfully created event");
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  cancelCreateEvent(){
    this.location.back();
  }
  

}
