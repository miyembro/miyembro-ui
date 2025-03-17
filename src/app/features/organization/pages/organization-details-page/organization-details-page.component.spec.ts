import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDetailsPageComponent } from './organization-details-page.component';

describe('OrganizationDetailsPageComponent', () => {
  let component: OrganizationDetailsPageComponent;
  let fixture: ComponentFixture<OrganizationDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
