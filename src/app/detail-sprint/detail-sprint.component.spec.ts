import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSprintComponent } from './detail-sprint.component';

describe('DetailSprintComponent', () => {
  let component: DetailSprintComponent;
  let fixture: ComponentFixture<DetailSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSprintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
