import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from "../../../event/components/event-list/event-list.component";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { SessionService } from 'src/app/core/services/session.service';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from "primeng/floatlabel"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventService } from 'src/app/core/services/event.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-my-events-page',
  imports: [
    CommonModule,
    DatePickerModule,
    EventListComponent,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SelectModule
  ],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
})
export class MyEventsPageComponent implements OnInit{

  cities: { label: string; value: string }[] = [];  // If you have cities too
  countries: { label: string; value: string }[] = [];  // 
  filterForm: FormGroup;
  name: string | null = null;
  onlineOptions: any [] = [];
  organizationId: string | undefined;
  filterValue: any | undefined;
  selectedCountry : string | undefined;

  constructor(
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.filterForm = this.formBuilder.group({
      name: [null],
      dateRange: [null],
      country: [null],
      city: [null],
      onlineStatuses: [null]
    });
  }

  ngOnInit(): void {
    this.onlineOptions = [{
      name: 'Online',
      value: true,
    },
    {
      name: 'In-person',
      value: false,
    }];
    this.filterForm.get('city')?.disable();
    this.getCountries();
    const session = this.sessionService.getSession();
    if(session) {
      this.organizationId = session.organization?.organizationId;
    }

    this.filterForm.valueChanges.subscribe(val => {
      console.log(val);
      console.log(this.filterForm.value);
      this.filterValue = this.filterForm.value;
    });
    this.filterForm.get('country')?.valueChanges.subscribe(country => {
      if(country) {
        this.getCities(country);
        this.selectedCountry = country;
        this.filterForm.get('city')?.enable();
      } else {
        this.filterForm.patchValue({
          city: null
        });
        this.filterForm.get('city')?.disable();
        this.selectedCountry = country;
        this.cities = [];
      }
    })
  }

  getCities(country: string) {
    this.eventService.getUniqueEventCities(country).subscribe(
      (res) => {
        this.cities = res.map((city: string) => ({ label: city, value: city }));
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getCountries() {
    this.eventService.getUniqueEventCountries().subscribe(
      (res) => {
        this.countries = res.map((country: string) => ({ label: country, value: country }));
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


  
}
