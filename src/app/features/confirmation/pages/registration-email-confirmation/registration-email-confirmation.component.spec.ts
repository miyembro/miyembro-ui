import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationEmailConfirmationComponent } from './registration-email-confirmation.component';

describe('RegistrationEmailConfirmationComponent', () => {
  let component: RegistrationEmailConfirmationComponent;
  let fixture: ComponentFixture<RegistrationEmailConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationEmailConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationEmailConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
