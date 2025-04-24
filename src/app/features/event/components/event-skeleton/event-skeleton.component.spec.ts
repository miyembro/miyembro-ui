import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSkeletonComponent } from './event-skeleton.component';

describe('EventSkeletonComponent', () => {
  let component: EventSkeletonComponent;
  let fixture: ComponentFixture<EventSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
