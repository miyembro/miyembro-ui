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

@Component({
  selector: 'app-my-events-page',
  imports: [
    CommonModule,
    DatePickerModule,
    EventListComponent,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
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
  organizationId: string | undefined;
  filterValue: any | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.filterForm = this.formBuilder.group({
      name: [null],
      dateRange: [null],
      country: [null],
      city: [null]
    });
  }

  ngOnInit(): void {
    const session = this.sessionService.getSession();
    if(session) {
      this.organizationId = session.organization?.organizationId;
    }

    this.filterForm.valueChanges.subscribe(val => {
      console.log(val);
      console.log(this.filterForm.value);
      this.filterValue = this.filterForm.value;
    });
  }
}
