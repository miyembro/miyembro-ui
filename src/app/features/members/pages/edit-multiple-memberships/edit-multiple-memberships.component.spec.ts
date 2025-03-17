import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMultipleMembershipsComponent } from './edit-multiple-memberships.component';

describe('EditMultipleMembershipsComponent', () => {
  let component: EditMultipleMembershipsComponent;
  let fixture: ComponentFixture<EditMultipleMembershipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMultipleMembershipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMultipleMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
