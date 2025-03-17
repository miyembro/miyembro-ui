import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoSignupComponent } from './additional-info-signup.component';

describe('AdditionalInfoSignupComponent', () => {
  let component: AdditionalInfoSignupComponent;
  let fixture: ComponentFixture<AdditionalInfoSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalInfoSignupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
