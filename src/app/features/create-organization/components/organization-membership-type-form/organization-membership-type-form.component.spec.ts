import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMembershipTypeFormComponent } from './organization-membership-type-form.component';

describe('OrganizationMembershipTypeFormComponent', () => {
  let component: OrganizationMembershipTypeFormComponent;
  let fixture: ComponentFixture<OrganizationMembershipTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationMembershipTypeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationMembershipTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
