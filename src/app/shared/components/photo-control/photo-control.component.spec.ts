import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoControlComponent } from './photo-control.component';

describe('PhotoControlComponent', () => {
  let component: PhotoControlComponent;
  let fixture: ComponentFixture<PhotoControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
