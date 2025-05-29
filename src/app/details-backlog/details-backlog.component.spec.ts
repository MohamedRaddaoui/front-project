import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBacklogComponent } from './details-backlog.component';

describe('DetailsBacklogComponent', () => {
  let component: DetailsBacklogComponent;
  let fixture: ComponentFixture<DetailsBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsBacklogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
