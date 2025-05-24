import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/question-detail/question-detail.component.spec.ts
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
========
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
>>>>>>>> 0ff1c035d5be780b080ae314ef4176ff9bebd0d9:src/app/eventdashboard/eventdashboard.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
