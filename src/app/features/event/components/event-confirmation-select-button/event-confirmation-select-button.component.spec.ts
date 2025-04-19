import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventConfirmationSelectButtonComponent } from './event-confirmation-select-button.component';

describe('EventConfirmationSelectButtonComponent', () => {
  let component: EventConfirmationSelectButtonComponent;
  let fixture: ComponentFixture<EventConfirmationSelectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventConfirmationSelectButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventConfirmationSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
