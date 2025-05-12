import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpComponent } from './dp.component';

describe('DpComponent', () => {
  let component: DpComponent;
  let fixture: ComponentFixture<DpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
