import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMembershipComponent } from './organization-membership.component';

describe('OrganizationMembershipComponent', () => {
  let component: OrganizationMembershipComponent;
  let fixture: ComponentFixture<OrganizationMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
