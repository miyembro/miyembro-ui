import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEventPageComponent } from './create-event-page.component';

describe('CreateEventPageComponent', () => {
  let component: CreateEventPageComponent;
  let fixture: ComponentFixture<CreateEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
