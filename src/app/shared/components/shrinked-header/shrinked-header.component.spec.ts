import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShrinkedHeaderComponent } from './shrinked-header.component';

describe('ShrinkedHeaderComponent', () => {
  let component: ShrinkedHeaderComponent;
  let fixture: ComponentFixture<ShrinkedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShrinkedHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShrinkedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
