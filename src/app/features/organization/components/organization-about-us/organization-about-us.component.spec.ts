import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAboutUsComponent } from './organization-about-us.component';

describe('OrganizationAboutUsComponent', () => {
  let component: OrganizationAboutUsComponent;
  let fixture: ComponentFixture<OrganizationAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
