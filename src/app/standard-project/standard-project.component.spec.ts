import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardProjectComponent } from './standard-project.component';

describe('StandardProjectComponent', () => {
  let component: StandardProjectComponent;
  let fixture: ComponentFixture<StandardProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
