import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from 'src/app/core/models/event-response';
import { AvatarModule } from 'primeng/avatar';
import { EventDateRangePipe } from 'src/app/shared/pipes/event-date-range.pipe';

@Component({
  selector: 'app-event-summary-details',
  imports: [
    AvatarModule, 
    CommonModule,
    EventDateRangePipe
  ],
  templateUrl: './event-summary-details.component.html',
  styleUrl: './event-summary-details.component.scss',
})
export class EventSummaryDetailsComponent implements OnChanges {

  @Input() event: EventResponse | undefined;
  @Input() showAvatar = true;

  eventPicUrl = 'assets/blank-profile-picture.jpg';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      if(this.event.eventPicUrl) {
        this.eventPicUrl = `${this.event.eventPicUrl}?v=${new Date().getTime()}`;
      }
    }
  }
  
}
