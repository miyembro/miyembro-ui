import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveJoinOrganizationRequestComponent } from './approve-join-organization-request.component';

describe('ApproveJoinOrganizationRequestComponent', () => {
  let component: ApproveJoinOrganizationRequestComponent;
  let fixture: ComponentFixture<ApproveJoinOrganizationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveJoinOrganizationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveJoinOrganizationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
