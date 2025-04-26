import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsAttendanceSummariesComponent } from './events-attendance-summaries.component';

describe('EventsAttendanceSummariesComponent', () => {
  let component: EventsAttendanceSummariesComponent;
  let fixture: ComponentFixture<EventsAttendanceSummariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsAttendanceSummariesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsAttendanceSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
