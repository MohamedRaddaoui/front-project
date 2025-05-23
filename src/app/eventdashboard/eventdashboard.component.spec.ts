import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventdashboardComponent } from './eventdashboard.component';

describe('EventdashboardComponent', () => {
  let component: EventdashboardComponent;
  let fixture: ComponentFixture<EventdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
