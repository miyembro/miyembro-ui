import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventListComponent } from "../../../event/components/event-list/event-list.component";
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { SessionService } from 'src/app/core/services/session.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from "primeng/floatlabel"

@Component({
  selector: 'app-my-events-page',
  imports: [
    CommonModule,
    DatePickerModule,
    EventListComponent,
    FloatLabelModule,
    FormsModule,
    InputTextModule,
    SelectModule
  ],
  templateUrl: './my-events-page.component.html',
  styleUrl: './my-events-page.component.scss',
})
export class MyEventsPageComponent implements OnInit{

  cities: { label: string; value: string }[] = [];  // If you have cities too
  countries: { label: string; value: string }[] = [];  // 
  name: string | null = null;
  organizationId: string | undefined;
  selectedCountry: string | null = null;
  selectedCity: string | null = null;
  selectedDateRange: any [] = [];

  constructor(
    private alertService: AlertService,
    private router: Router,
    private sessionService: SessionService,
  ) {
    
  }

  ngOnInit(): void {
    const session = this.sessionService.getSession();
    if(session) {
      this.organizationId = session.organization?.organizationId;
    }
  }
}
