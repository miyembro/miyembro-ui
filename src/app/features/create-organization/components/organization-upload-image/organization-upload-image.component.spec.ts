import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationUploadImageComponent } from './organization-upload-image.component';

describe('OrganizationUploadImageComponent', () => {
  let component: OrganizationUploadImageComponent;
  let fixture: ComponentFixture<OrganizationUploadImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationUploadImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
