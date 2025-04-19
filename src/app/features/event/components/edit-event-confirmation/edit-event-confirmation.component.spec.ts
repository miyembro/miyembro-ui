import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEventConfirmationComponent } from './edit-event-confirmation.component';

describe('EditEventConfirmationComponent', () => {
  let component: EditEventConfirmationComponent;
  let fixture: ComponentFixture<EditEventConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
