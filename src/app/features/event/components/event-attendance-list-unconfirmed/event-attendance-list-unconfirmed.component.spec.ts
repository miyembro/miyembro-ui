import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceListUnconfirmedComponent } from './event-attendance-list-unconfirmed.component';

describe('EventAttendanceListUnconfirmedComponent', () => {
  let component: EventAttendanceListUnconfirmedComponent;
  let fixture: ComponentFixture<EventAttendanceListUnconfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceListUnconfirmedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceListUnconfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
