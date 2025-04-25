import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListBoxSkeletonComponent } from './list-box-skeleton.component';

describe('ListBoxSkeletonComponent', () => {
  let component: ListBoxSkeletonComponent;
  let fixture: ComponentFixture<ListBoxSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBoxSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListBoxSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
