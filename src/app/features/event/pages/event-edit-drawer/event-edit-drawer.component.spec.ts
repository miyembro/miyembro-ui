import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEditDrawerComponent } from './event-edit-drawer.component';

describe('EventEditDrawerComponent', () => {
  let component: EventEditDrawerComponent;
  let fixture: ComponentFixture<EventEditDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventEditDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventEditDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
