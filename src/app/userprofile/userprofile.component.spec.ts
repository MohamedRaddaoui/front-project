import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserproofileComponent } from './userprofile.component';

describe('UserproofileComponent', () => {
  let component: UserproofileComponent;
  let fixture: ComponentFixture<UserproofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserproofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserproofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
