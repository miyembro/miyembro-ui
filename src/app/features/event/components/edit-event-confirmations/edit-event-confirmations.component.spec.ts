import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEventConfirmationsComponent } from './edit-event-confirmations.component';

describe('EditEventConfirmationsComponent', () => {
  let component: EditEventConfirmationsComponent;
  let fixture: ComponentFixture<EditEventConfirmationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventConfirmationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventConfirmationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
