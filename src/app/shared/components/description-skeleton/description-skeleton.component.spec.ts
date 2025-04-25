import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescriptionSkeletonComponent } from './description-skeleton.component';

describe('DescriptionSkeletonComponent', () => {
  let component: DescriptionSkeletonComponent;
  let fixture: ComponentFixture<DescriptionSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescriptionSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DescriptionSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
