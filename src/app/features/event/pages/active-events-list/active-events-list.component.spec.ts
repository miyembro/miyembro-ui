import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveEventsListComponent } from './active-events-list.component';

describe('ActiveEventsListComponent', () => {
  let component: ActiveEventsListComponent;
  let fixture: ComponentFixture<ActiveEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveEventsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
