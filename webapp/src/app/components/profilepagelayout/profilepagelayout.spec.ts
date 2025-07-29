import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profilepagelayout } from './profilepagelayout';

describe('Profilepagelayout', () => {
  let component: Profilepagelayout;
  let fixture: ComponentFixture<Profilepagelayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profilepagelayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profilepagelayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
