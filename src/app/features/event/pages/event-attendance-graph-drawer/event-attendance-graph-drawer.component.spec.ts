import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventAttendanceGraphDrawerComponent } from './event-attendance-graph-drawer.component';

describe('EventAttendanceGraphDrawerComponent', () => {
  let component: EventAttendanceGraphDrawerComponent;
  let fixture: ComponentFixture<EventAttendanceGraphDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAttendanceGraphDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventAttendanceGraphDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
