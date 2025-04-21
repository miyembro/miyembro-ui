import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-attendance-turnout',
  imports: [CommonModule],
  templateUrl: './event-attendance-turnout.component.html',
  styleUrl: './event-attendance-turnout.component.scss',
})
export class EventAttendanceTurnoutComponent {

  @Input() eventId: string | undefined;
}
