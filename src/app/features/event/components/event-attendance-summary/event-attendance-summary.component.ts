import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventAttendanceSummary } from 'src/app/core/models/event-attendance-summary';
import { TagModule } from 'primeng/tag';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';

interface GroupedSummaries {
  label: 'Going' | 'Not going';
  items: EventAttendanceSummary[];
  total: number;
}

@Component({
  selector: 'app-event-attendance-summary',
  imports: [
    CommonModule,
    TagModule
  ],
  templateUrl: './event-attendance-summary.component.html',
  styleUrl: './event-attendance-summary.component.scss',
})
export class EventAttendanceSummaryComponent {

  @Input() eventAttendanceSummaries: EventAttendanceSummary[] = [];

  get groupedSummaries(): GroupedSummaries[] {
    const goingItems = this.eventAttendanceSummaries.filter(
      s => s.eventConfirmationStatus === EventConfirmationStatus.YES
    );
    const notGoingItems = this.eventAttendanceSummaries.filter(
      s => s.eventConfirmationStatus !== EventConfirmationStatus.YES
    );

    const sum = (arr: EventAttendanceSummary[]) =>
      arr.reduce((acc, cur) => acc + cur.attendanceNumber, 0);

    return [
      { label: 'Going',     items: goingItems,    total: sum(goingItems) },
      { label: 'Not going', items: notGoingItems, total: sum(notGoingItems) }
    ];
  }
}