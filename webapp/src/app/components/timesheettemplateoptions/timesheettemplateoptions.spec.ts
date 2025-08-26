import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Timesheettemplateoptions } from './timesheettemplateoptions';

describe('Timesheettemplateoptions', () => {
  let component: Timesheettemplateoptions;
  let fixture: ComponentFixture<Timesheettemplateoptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Timesheettemplateoptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Timesheettemplateoptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
