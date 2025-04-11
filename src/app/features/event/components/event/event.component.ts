import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from 'src/app/core/models/event-response';
import { CardModule } from 'primeng/card';
import { EventDateRangePipe } from 'src/app/shared/pipes/event-date-range.pipe';
import { TagModule } from 'primeng/tag';
import { HasAddressPipe } from "../../../../shared/pipes/has-address.pipe";

@Component({
  selector: 'app-event',
  imports: [
    CardModule,
    CommonModule,
    EventDateRangePipe,
    HasAddressPipe,
    TagModule
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
})
export class EventComponent {

  @Input() event: EventResponse | undefined;
  
}
