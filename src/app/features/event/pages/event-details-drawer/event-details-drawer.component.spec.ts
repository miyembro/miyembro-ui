import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsDrawerComponent } from './event-details-drawer.component';

describe('EventDetailsDrawerComponent', () => {
  let component: EventDetailsDrawerComponent;
  let fixture: ComponentFixture<EventDetailsDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
