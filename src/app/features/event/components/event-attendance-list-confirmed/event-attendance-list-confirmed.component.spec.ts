import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceListConfirmedComponent } from './event-attendance-list-confirmed.component';

describe('EventAttendanceListConfirmedComponent', () => {
  let component: EventAttendanceListConfirmedComponent;
  let fixture: ComponentFixture<EventAttendanceListConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceListConfirmedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceListConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
