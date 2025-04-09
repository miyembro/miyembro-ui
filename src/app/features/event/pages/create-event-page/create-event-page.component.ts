import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from "../../components/event-form/event-form.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';

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
export class CreateEventPageComponent {

  eventForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.eventForm = this.formBuilder.group({
      eventId: [null],
      organizationId: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      startEventDate: ['', Validators.required],
      endEventDate: [''],
      eventPicUrl: [''],
      eventPlace: [''],
      eventAddress: this.formBuilder.group({
        street: [null],
        city: [null],
        provinceState: [null],
        postalCode: [null],
        country: [null]
      })
    });
  }

  createEvent(){
    console.log('on create');
  }

  cancelCreateEvent(){
    this.location.back();
  }
  

}
