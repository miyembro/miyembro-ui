import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationItemGridSkeletonComponent } from './organization-item-grid-skeleton.component';

describe('OrganizationItemGridSkeletonComponent', () => {
  let component: OrganizationItemGridSkeletonComponent;
  let fixture: ComponentFixture<OrganizationItemGridSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationItemGridSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationItemGridSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
