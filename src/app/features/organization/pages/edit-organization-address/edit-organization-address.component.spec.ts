import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationAddressComponent } from './edit-organization-address.component';

describe('EditOrganizationAddressComponent', () => {
  let component: EditOrganizationAddressComponent;
  let fixture: ComponentFixture<EditOrganizationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrganizationAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrganizationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
