import { ChangeDetectorRef, Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { Skeleton } from 'primeng/skeleton';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from "primeng/floatlabel";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventAttendanceSummaryService } from 'src/app/core/services/event-attendance-summary.service';
import { SessionService } from 'src/app/core/services/session.service';
import { ButtonModule } from 'primeng/button';
import { EventAttendanceSummaryResponse } from 'src/app/core/models/event-attendance-summary-response';

@Component({
  selector: 'app-events-attendance-summaries',
  imports: [
    ButtonModule,
    ChartModule,
    CommonModule,
    DatePickerModule,
    FloatLabelModule,
    FormsModule,
    ReactiveFormsModule,
    Skeleton
  ],
  templateUrl: './events-attendance-summaries.component.html',
  styleUrls: ['./events-attendance-summaries.component.scss'],
})
export class EventsAttendanceSummariesComponent implements OnInit {

  eventAttendanceSummaryResponses: EventAttendanceSummaryResponse[] = [];
  eventsAttendanceSummariesForm: FormGroup;

  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  constructor(
    private eventAttendanceSummaryService: EventAttendanceSummaryService,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
  ) {
    this.eventsAttendanceSummariesForm = this.formBuilder.group({
      startDate: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.initChart();
  }

  onShowGraph() {
    const dateRange: Date[] = this.eventsAttendanceSummariesForm.get('startDate')?.value;

    if (!dateRange || dateRange.length !== 2) {
      console.error('Invalid date range selection');
      return;
    }

    const [startDate, endDate] = dateRange;

    this.eventAttendanceSummaryService
      .getEventAttendanceSummariesBetweenDates(startDate, endDate)
      .subscribe({
        next: (summaries) => {
          this.eventAttendanceSummaryResponses = summaries;
          this.updateChartData(summaries);
        },
        error: (err) => console.error('Error fetching events:', err)
      });
  }

  private initChart() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Read CSS variables with fallbacks
    const docStyle = getComputedStyle(document.documentElement);
    const textColor = docStyle.getPropertyValue('--text-color')?.trim() || '#333';
    const textColorSecondary = docStyle.getPropertyValue('--text-color-secondary')?.trim() || '#666';
    const surfaceBorder = docStyle.getPropertyValue('--surface-border')?.trim() || '#e0e0e0';

    this.data = {
      labels: [],
      datasets: [
        { label: 'Going (Yes)', backgroundColor: docStyle.getPropertyValue('--p-green-700'), borderColor: docStyle.getPropertyValue('--p-green-700'), borderWidth: 1, data: [] },
        { label: 'Not Going (No)', backgroundColor: docStyle.getPropertyValue('--p-red-700'), borderColor: docStyle.getPropertyValue('--p-red-700'), borderWidth: 1, data: [] },
        { label: 'Maybe', backgroundColor: docStyle.getPropertyValue('--p-sky-700'), borderColor: docStyle.getPropertyValue('--p-sky-700'), borderWidth: 1, data: [] },
        { label: 'Unconfirmed', backgroundColor: docStyle.getPropertyValue('--p-surface-600'), borderColor: docStyle.getPropertyValue('--p-surface-600'), borderWidth: 1, data: [] }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: { labels: { color: textColor, font: { size: 14 } } },
        tooltip: { mode: 'index', intersect: false, bodyFont: { size: 14 } }
      },
      scales: {
        x: {
          offset: true,
          ticks: { color: textColorSecondary, font: { weight: '500', size: 12 } },
          grid: {
            display: true,
            color: surfaceBorder,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
            lineWidth: 1,
            borderDash: [5, 5]
          },
          title: { display: true, text: 'Events', color: textColor, font: { size: 16, weight: 'bold' } }
        },
        y: {
          ticks: { color: textColorSecondary, stepSize: 1, precision: 0 },
          grid: {
            display: true,
            color: surfaceBorder,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
            lineWidth: 1,
            borderDash: [5, 5]
          },
          title: { display: true, text: 'Number of Attendees', color: textColor, font: { size: 16, weight: 'bold' } },
          beginAtZero: true
        }
      }
    };

    this.cd.markForCheck();
  }

  private updateChartData(summaries: EventAttendanceSummaryResponse[]) {
    if (!this.data) return;

    const newData = {
      labels: summaries.map(s => s.eventName),
      datasets: this.data.datasets.map((ds: any, idx: number) => ({
        ...ds,
        data: summaries.map(s => {
          switch (idx) {
            case 0: return s.yesCount;
            case 1: return s.noCount;
            case 2: return s.maybeCount;
            case 3: return s.unconfirmedCount;
            default: return 0;
          }
        })
      }))
    };

    this.data = JSON.parse(JSON.stringify(newData));
    this.options = { ...this.options };
    this.cd.detectChanges();
  }
}
