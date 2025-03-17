import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationItemGridComponent } from './organization-item-grid.component';

describe('OrganizationItemGridComponent', () => {
  let component: OrganizationItemGridComponent;
  let fixture: ComponentFixture<OrganizationItemGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationItemGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationItemGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
