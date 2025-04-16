import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCreateDrawerComponent } from './event-create-drawer.component';

describe('EventCreateDrawerComponent', () => {
  let component: EventCreateDrawerComponent;
  let fixture: ComponentFixture<EventCreateDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCreateDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCreateDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
