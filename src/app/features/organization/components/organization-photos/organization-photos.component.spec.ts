import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPhotosComponent } from './organization-photos.component';

describe('OrganizationPhotosComponent', () => {
  let component: OrganizationPhotosComponent;
  let fixture: ComponentFixture<OrganizationPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationPhotosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
