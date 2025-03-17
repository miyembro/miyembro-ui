import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoControlCropperComponent } from './photo-control-cropper.component';

describe('PhotoControlCropperComponent', () => {
  let component: PhotoControlCropperComponent;
  let fixture: ComponentFixture<PhotoControlCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoControlCropperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoControlCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
