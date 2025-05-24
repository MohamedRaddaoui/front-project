import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumProjectComponent } from './scrum-project.component';

describe('ScrumProjectComponent', () => {
  let component: ScrumProjectComponent;
  let fixture: ComponentFixture<ScrumProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
