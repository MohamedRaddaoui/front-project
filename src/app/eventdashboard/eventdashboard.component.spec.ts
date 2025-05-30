import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionDetailComponent } from './question-detail.component';

describe('QuestionDetailComponent', () => {
  let component: QuestionDetailComponent;
  let fixture: ComponentFixture<QuestionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionDetailComponent);

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
