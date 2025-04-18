import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceListPageComponent } from './event-attendance-list-page.component';

describe('EventAttendanceListPageComponent', () => {
  let component: EventAttendanceListPageComponent;
  let fixture: ComponentFixture<EventAttendanceListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
