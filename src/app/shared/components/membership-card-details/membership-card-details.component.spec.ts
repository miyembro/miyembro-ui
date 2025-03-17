import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipCardDetailsComponent } from './membership-card-details.component';

describe('MembershipCardDetailsComponent', () => {
  let component: MembershipCardDetailsComponent;
  let fixture: ComponentFixture<MembershipCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipCardDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
