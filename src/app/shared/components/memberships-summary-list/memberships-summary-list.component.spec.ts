import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembershipsSummaryListComponent } from './memberships-summary-list.component';

describe('MembershipsSummaryListComponent', () => {
  let component: MembershipsSummaryListComponent;
  let fixture: ComponentFixture<MembershipsSummaryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipsSummaryListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MembershipsSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
