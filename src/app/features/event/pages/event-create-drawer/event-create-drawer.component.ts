import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventFormType } from 'src/app/core/models/event-form-type';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { startDateBeforeEndDateValidator } from 'src/app/core/validators/start-date-before-end-date-validator';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';

@Component({
  selector: 'app-event-create-drawer',
  imports: [
    BackgroundComponent,
    ButtonModule,
    CommonModule,
    DrawerModule,
    EventFormComponent
  ],
  templateUrl: './event-create-drawer.component.html',
  styleUrl: './event-create-drawer.component.scss',
})
export class EventCreateDrawerComponent {

  eventForm: FormGroup;
  organizationId: string | undefined;
  visible = true;

  EventFormType = EventFormType;

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
      this.organizationId = params.get('organizationId')!;
      this.eventForm.patchValue({
        organizationId: this.organizationId
      });
    });
  } 

  cancelCreateEvent(){
    this.location.back();
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
        this.eventService.notifyEventUpdated(); 
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

  closeDrawer() {
    this.router.navigate(['../../'], { 
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'preserve'
    });
  }
}
