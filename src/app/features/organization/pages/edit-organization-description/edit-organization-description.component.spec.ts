import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationDescriptionComponent } from './edit-organization-description.component';

describe('EditOrganizationDescriptionComponent', () => {
  let component: EditOrganizationDescriptionComponent;
  let fixture: ComponentFixture<EditOrganizationDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrganizationDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrganizationDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
