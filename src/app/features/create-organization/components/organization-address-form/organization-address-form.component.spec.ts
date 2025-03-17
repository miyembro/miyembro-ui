import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAddressFormComponent } from './organization-address-form.component';

describe('OrganizationAddressFormComponent', () => {
  let component: OrganizationAddressFormComponent;
  let fixture: ComponentFixture<OrganizationAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationAddressFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
