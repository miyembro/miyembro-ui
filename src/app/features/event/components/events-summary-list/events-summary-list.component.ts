import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from 'src/app/core/models/event-response';
import { ListboxModule } from 'primeng/listbox';
import { EventSummaryDetailsComponent } from "../event-summary-details/event-summary-details.component";
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';

@Component({
  selector: 'app-events-summary-list',
  imports: [
    CommonModule,
    ListboxModule,
    EventSummaryDetailsComponent
],
  templateUrl: './events-summary-list.component.html',
  styleUrl: './events-summary-list.component.scss',
})
export class EventsSummaryListComponent {

  @Input() events: EventSummaryResponse [] = [];
  
}
