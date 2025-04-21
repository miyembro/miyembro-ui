import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceTurnoutComponent } from './event-attendance-turnout.component';

describe('EventAttendanceTurnoutComponent', () => {
  let component: EventAttendanceTurnoutComponent;
  let fixture: ComponentFixture<EventAttendanceTurnoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceTurnoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceTurnoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
