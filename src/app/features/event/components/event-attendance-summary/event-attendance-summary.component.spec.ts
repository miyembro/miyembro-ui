import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceSummaryComponent } from './event-attendance-summary.component';

describe('EventAttendanceSummaryComponent', () => {
  let component: EventAttendanceSummaryComponent;
  let fixture: ComponentFixture<EventAttendanceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
