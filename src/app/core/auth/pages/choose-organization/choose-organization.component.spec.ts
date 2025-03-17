import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseOrganizationComponent } from './choose-organization.component';

describe('ChooseOrganizationComponent', () => {
  let component: ChooseOrganizationComponent;
  let fixture: ComponentFixture<ChooseOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
