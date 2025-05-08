import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdpComponent } from './adp.component';

describe('AdpComponent', () => {
  let component: AdpComponent;
  let fixture: ComponentFixture<AdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
