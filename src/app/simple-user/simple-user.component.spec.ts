import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleUserComponent } from './simple-user.component';

describe('SimpleUserComponent', () => {
  let component: SimpleUserComponent;
  let fixture: ComponentFixture<SimpleUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
