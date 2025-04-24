import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { EventAttendanceSummaryService } from 'src/app/core/services/event-attendance-summary.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';
import { EventAttendanceSummary } from 'src/app/core/models/event-attendance-summary';
import { ChartModule } from 'primeng/chart';
import { EventConfirmationStatus } from 'src/app/core/models/event-confirmation-status.enum';
import { EventAttendanceSummaryComponent } from '../event-attendance-summary/event-attendance-summary.component';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-event-attendance-turnout',
  imports: [
    ChartModule,
    CommonModule,
    EventAttendanceSummaryComponent,
    Skeleton
  ],
  templateUrl: './event-attendance-turnout.component.html',
  styleUrl: './event-attendance-turnout.component.scss',
})
export class EventAttendanceTurnoutComponent implements OnChanges{

  @Input() eventId: string | undefined;

  data: any;
  loading = false;
  options: any;
  eventAttendanceSummaries: EventAttendanceSummary [] = [];

  constructor(
    private alertService : AlertService,
    private dialogService: DialogService,
    private eventAttendanceSummaryService: EventAttendanceSummaryService,
    private loaderService: LoaderService,
    private router: Router,
    private sessionService: SessionService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventId'] && this.eventId) {
      this.getEventAttendanceSummaries();
    }
  }

  private getEventAttendanceSummaries() {
    this.loading = true;
    this.eventAttendanceSummaryService.getEventAttendanceSummaries(this.eventId).subscribe(
      (res) => {
        console.log(res);
        this.loading = false;
        this.eventAttendanceSummaries = res;
        this.setData(this.eventAttendanceSummaries);
        this.loaderService.hideLoader(this.router.url);
      },
      (err: any) => {
        console.log(err);
        this.loading = false;
        this.loaderService.hideLoader(this.router.url);
        this.alertService.error(this.router.url, 'Error', err.error.message);
      }
    );
  }

  private setData(eventSummaries: EventAttendanceSummary[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  
    // Define two categories: "Going" (YES) and "Not Going" (stacked NO, MAYBE, UNCONFIRMED)
    const labels = ['Attendance']; // One bar for YES, one stacked bar for NO/MAYBE/UNCONFIRMED
  
    // Extract data
    const goingCount = eventSummaries.find(s => s.eventConfirmationStatus === EventConfirmationStatus.YES)?.attendanceNumber || 0;
    const noCount = eventSummaries.find(s => s.eventConfirmationStatus === EventConfirmationStatus.NO)?.attendanceNumber || 0;
    const maybeCount = eventSummaries.find(s => s.eventConfirmationStatus === EventConfirmationStatus.MAYBE)?.attendanceNumber || 0;
    const unconfirmedCount = eventSummaries.find(s => s.eventConfirmationStatus === EventConfirmationStatus.UNCONFIRMED)?.attendanceNumber || 0;
  
    this.data = {
      labels: labels, // X-axis labels
      datasets: [
        {
          label: 'Going',
          data: [goingCount], // Assign count to the correct label
          backgroundColor: documentStyle.getPropertyValue('--p-green-700'),
          borderColor: documentStyle.getPropertyValue('--p-green-700'),
          borderWidth: 1,
          stack: 'Stack 1' // Separate YES from others
        },
        {
          label: 'Nope',
          data: [noCount], // Assign NO count to the same label
          backgroundColor: documentStyle.getPropertyValue('--p-red-700'),
          borderColor: documentStyle.getPropertyValue('--p-red-700'),
          borderWidth: 1,
          stack: 'Stack 2' // Stack NO, MAYBE, UNCONFIRMED together
        },
        {
          label: 'Maybe',
          data: [maybeCount], // Assign MAYBE count
          backgroundColor: documentStyle.getPropertyValue('--p-sky-700'),
          borderColor: documentStyle.getPropertyValue('--p-sky-700'),
          borderWidth: 1,
          stack: 'Stack 2' // Same stack group as NO
        },
        {
          label: 'Unconfirmed',
          data: [unconfirmedCount], // Assign UNCONFIRMED count
          backgroundColor: documentStyle.getPropertyValue('--p-surface-600'),
          borderColor: documentStyle.getPropertyValue('--p-surface-600'),
          borderWidth: 1,
          stack: 'Stack 2' // Same stack group as NO/MAYBE
        }
      ]
    };
  
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: { weight: 500 }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          stacked: true, // Enable stacking
          ticks: {
            color: textColorSecondary,
            stepSize: 1 // Forces y-axis to increment by 1
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
  
  


  private getBackgroundColor(eventConfirmationStatus: EventConfirmationStatus | undefined): string {
    console.log(eventConfirmationStatus);
    
    if (eventConfirmationStatus === EventConfirmationStatus.YES) {
      return '--p-green-700'; 
    } else if (eventConfirmationStatus === EventConfirmationStatus.NO) {
      return '--p-red-700'; 
    } else if (eventConfirmationStatus === EventConfirmationStatus.MAYBE) {
      return '--p-sky-700'; 
    } else {
      return '--p-surface-600';
    }
  }
  
  
}
