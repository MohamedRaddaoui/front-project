import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesComponent } from './statistique.component';

describe('StatistiqueComponent', () => {
  let component: StatistiquesComponent;
  let fixture: ComponentFixture<StatistiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
