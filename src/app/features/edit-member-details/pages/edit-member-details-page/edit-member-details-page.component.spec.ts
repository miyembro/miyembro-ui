import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMemberDetailsPageComponent } from './edit-member-details-page.component';

describe('EditMemberDetailsPageComponent', () => {
  let component: EditMemberDetailsPageComponent;
  let fixture: ComponentFixture<EditMemberDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMemberDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMemberDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
