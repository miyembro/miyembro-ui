import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { EventFormComponent } from "../../components/event-form/event-form.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { emptyEditorValidator } from 'src/app/core/validators/empty-editor-validator';
import { startDateBeforeEndDateValidator } from 'src/app/core/validators/start-date-before-end-date-validator';

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
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.eventForm = this.formBuilder.group({
      eventId: [null],
      organizationId: [null],
      name: ['', Validators.required],
      description: ['', [emptyEditorValidator(), Validators.required]],
      startEventDate: ['', [startDateBeforeEndDateValidator('endEventDate'), Validators.required]],
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

  ngOnInit(): void {
    this.eventForm.get('endEventDate')?.valueChanges.subscribe(() => {
      this.eventForm.get('startEventDate')?.updateValueAndValidity();
    });    
  }
  
  createEvent(){
    console.log('on create');
  }

  cancelCreateEvent(){
    this.location.back();
  }
  

}
