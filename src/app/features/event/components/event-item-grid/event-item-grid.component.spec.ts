import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventItemGridComponent } from './event-item-grid.component';

describe('EventItemGridComponent', () => {
  let component: EventItemGridComponent;
  let fixture: ComponentFixture<EventItemGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventItemGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
