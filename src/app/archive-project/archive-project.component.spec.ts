import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveProjectComponent } from './archive-project.component';

describe('ArchiveProjectComponent', () => {
  let component: ArchiveProjectComponent;
  let fixture: ComponentFixture<ArchiveProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
