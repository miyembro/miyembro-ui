import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsSkeletonComponent } from './contact-details-skeleton.component';

describe('ContactDetailsSkeletonComponent', () => {
  let component: ContactDetailsSkeletonComponent;
  let fixture: ComponentFixture<ContactDetailsSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetailsSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
