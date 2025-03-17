import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInformationDialogComponent } from './organization-information-dialog.component';

describe('OrganizationInformationDialogComponent', () => {
  let component: OrganizationInformationDialogComponent;
  let fixture: ComponentFixture<OrganizationInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationInformationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
