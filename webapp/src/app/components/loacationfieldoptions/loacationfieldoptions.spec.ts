import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loacationfieldoptions } from './loacationfieldoptions';

describe('Loacationfieldoptions', () => {
  let component: Loacationfieldoptions;
  let fixture: ComponentFixture<Loacationfieldoptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loacationfieldoptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loacationfieldoptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
