import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEventPageComponent } from './edit-event-page.component';

describe('EditEventPageComponent', () => {
  let component: EditEventPageComponent;
  let fixture: ComponentFixture<EditEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
