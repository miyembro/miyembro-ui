import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventResponse } from 'src/app/core/models/event-response';
import { EventDateRangePipe } from 'src/app/shared/pipes/event-date-range.pipe';

@Component({
  selector: 'app-event-item-grid',
  imports: [
    CommonModule,
    EventDateRangePipe
  ],
  templateUrl: './event-item-grid.component.html',
  styleUrl: './event-item-grid.component.scss',
})
export class EventItemGridComponent implements OnChanges {
 

  @Input() event: EventResponse | undefined;
  @Output() eventClickChanged = new EventEmitter<EventResponse | undefined>();

  imageUrl = 'assets/default-event-poster.jpg';


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && this.event) {
      if(this.event.eventPicUrl) {
        this.imageUrl = this.event.eventPicUrl;
      }
    }
  }

  onClickEvent(event: EventResponse | undefined) {
    this.eventClickChanged.emit(event);
  }

  onKeyboardEvent(keyboardEvent: KeyboardEvent, event: any) {
    if (event.key === 'Enter' || event.key === ' ') {  
      this.onClickEvent(event);  
    }
  }

}
