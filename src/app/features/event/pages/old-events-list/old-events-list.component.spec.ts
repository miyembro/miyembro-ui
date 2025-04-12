import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OldEventsListComponent } from './old-events-list.component';

describe('OldEventsListComponent', () => {
  let component: OldEventsListComponent;
  let fixture: ComponentFixture<OldEventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldEventsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OldEventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
