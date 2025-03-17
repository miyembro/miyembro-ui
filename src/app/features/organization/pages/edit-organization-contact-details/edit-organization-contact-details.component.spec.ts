import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationContactDetailsComponent } from './edit-organization-contact-details.component';

describe('EditOrganizationContactDetailsComponent', () => {
  let component: EditOrganizationContactDetailsComponent;
  let fixture: ComponentFixture<EditOrganizationContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrganizationContactDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrganizationContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
