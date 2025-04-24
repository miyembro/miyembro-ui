import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventItemGridSkeletonComponent } from './event-item-grid-skeleton.component';

describe('EventItemGridSkeletonComponent', () => {
  let component: EventItemGridSkeletonComponent;
  let fixture: ComponentFixture<EventItemGridSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventItemGridSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventItemGridSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
