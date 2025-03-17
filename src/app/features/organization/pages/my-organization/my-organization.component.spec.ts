import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrganizationComponent } from './my-organization.component';

describe('MyOrganizationComponent', () => {
  let component: MyOrganizationComponent;
  let fixture: ComponentFixture<MyOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrganizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
