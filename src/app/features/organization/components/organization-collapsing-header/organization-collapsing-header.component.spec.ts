import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCollapsingHeaderComponent } from './organization-collapsing-header.component';

describe('OrganizationCollapsingHeaderComponent', () => {
  let component: OrganizationCollapsingHeaderComponent;
  let fixture: ComponentFixture<OrganizationCollapsingHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationCollapsingHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCollapsingHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
