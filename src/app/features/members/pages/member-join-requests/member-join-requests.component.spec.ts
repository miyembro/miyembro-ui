import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberJoinRequestsComponent } from './member-join-requests.component';

describe('MemberJoinRequestsComponent', () => {
  let component: MemberJoinRequestsComponent;
  let fixture: ComponentFixture<MemberJoinRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberJoinRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberJoinRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
