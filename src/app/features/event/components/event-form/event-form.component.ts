import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { EventFormType } from 'src/app/core/models/event-form-type';
import { TooltipModule } from 'primeng/tooltip';
import { FormErrorsPipe } from 'src/app/shared/pipes/form-errors.pipe';
import { FormErrorsFilterPipe } from 'src/app/shared/pipes/form-errors-filter.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PhotoControlComponent } from 'src/app/shared/components/photo-control/photo-control.component';
import { AddressFormComponent } from "../address-form/address-form.component";
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-event-form',
  imports: [
    AddressFormComponent,
    CommonModule,
    DatePickerModule,
    DividerModule,
    EditorModule,
    FloatLabelModule,
    FormErrorsPipe,
    FormErrorsFilterPipe,
    InputTextModule,
    PhotoControlComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    TooltipModule
],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss',
})
export class EventFormComponent implements OnInit {

  @Input() formType: EventFormType = EventFormType.ADD_EVENT;
  @Input() eventForm!: FormGroup; 
  @Output() eventFormChange = new EventEmitter<FormGroup>();

  dateNow: Date = new Date(); 
  isOnline = false;
  minEndDate: Date | null = null;
  EventFormType = EventFormType;


  get eventAddressForm(): FormGroup {
    return this.eventForm.get('eventAddress') as FormGroup;
  }

  constructor(
    private formBuilder: FormBuilder,
  ) {

  }


  ngOnInit(): void {
    this.minEndDate = this.dateNow;
    this.eventForm.valueChanges.subscribe(() => {
      this.emitForm();
    });
    this.eventForm.get('startEventDate')?.valueChanges.subscribe((value) => {
      if (value) {
        const startDate = new Date(value);
        // Set minEndDate to be the same date as startEventDate, with the time
        this.minEndDate = startDate;
      } else {
        this.minEndDate = null;
      }
    });
    this.eventForm.get('isOnline')?.valueChanges.subscribe((value) => {
      if(value) {
        this.eventForm.patchValue({
          eventAddress: null
        });
        this.isOnline = true;
      } else {
        this.eventAddressForm.patchValue({
          eventAddress: this.formBuilder.group({
            eventAddressId: [null],
            street: [null],
            city: [null],
            provinceState: [null],
            postalCode: [null],
            country: [null]
          })
        });
        this.isOnline = false;
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.eventForm.controls;
  }

  get fgErrors(): { [key: string]: ValidationErrors } | null {
    return this.eventForm.errors;
  }

  emitForm(): void {
    this.eventFormChange.emit(this.eventForm);
  }

  isControlInvalidAndTouched(groupName: string, controlName: string): boolean {
    const group = this.eventForm.get(groupName) as FormGroup;
    const control = group ? group.get(controlName) : null;
    return control ? control.invalid && control.touched : false;
  }

  getControlErrors(groupName: string, controlName: string): ValidationErrors | null {
    const group = this.eventForm.get(groupName) as FormGroup;
    const control = group ? group.get(controlName) : null;
    return control ? control.errors : null;

  }
}
