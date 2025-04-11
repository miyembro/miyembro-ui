import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDateRangePipe } from 'src/app/shared/pipes/event-date-range.pipe';
import { EventSummaryResponse } from 'src/app/core/models/event-summary-response';
import { HasAddressPipe } from "../../../../shared/pipes/has-address.pipe";
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-event-item-grid',
  imports: [
    CommonModule,
    EventDateRangePipe,
    HasAddressPipe,
    TagModule
],
  templateUrl: './event-item-grid.component.html',
  styleUrl: './event-item-grid.component.scss',
})
export class EventItemGridComponent implements OnChanges {
 

  @Input() event: EventSummaryResponse | undefined;
  @Output() eventClickChanged = new EventEmitter<EventSummaryResponse | undefined>();

  imageUrl = 'assets/default-event-poster.jpg';


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      if(this.event.eventPicUrl) {
        this.imageUrl = this.event.eventPicUrl;
        console.log(this.event);
      }
    }
  }

  onClickEvent(event: EventSummaryResponse | undefined) {
    this.eventClickChanged.emit(event);
  }

  onKeyboardEvent(keyboardEvent: KeyboardEvent, event: any) {
    if (event.key === 'Enter' || event.key === ' ') {  
      this.onClickEvent(event);  
    }
  }
}
