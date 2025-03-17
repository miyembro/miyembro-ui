import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberOtherDetailsComponent } from './member-other-details.component';

describe('MemberOtherDetailsComponent', () => {
  let component: MemberOtherDetailsComponent;
  let fixture: ComponentFixture<MemberOtherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberOtherDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
