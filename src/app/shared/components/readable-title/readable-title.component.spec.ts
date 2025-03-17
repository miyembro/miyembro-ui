import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadableTitleComponent } from './readable-title.component';

describe('ReadableTitleComponent', () => {
  let component: ReadableTitleComponent;
  let fixture: ComponentFixture<ReadableTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadableTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadableTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
