import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveMultipleJoinOrganizationRequestsComponent } from './approve-multiple-join-organization-requests.component';

describe('ApproveMultipleJoinOrganizationRequestsComponent', () => {
  let component: ApproveMultipleJoinOrganizationRequestsComponent;
  let fixture: ComponentFixture<ApproveMultipleJoinOrganizationRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveMultipleJoinOrganizationRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveMultipleJoinOrganizationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
