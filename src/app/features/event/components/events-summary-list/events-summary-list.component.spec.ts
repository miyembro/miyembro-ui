import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsSummaryListComponent } from './events-summary-list.component';

describe('EventsSummaryListComponent', () => {
  let component: EventsSummaryListComponent;
  let fixture: ComponentFixture<EventsSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsSummaryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
