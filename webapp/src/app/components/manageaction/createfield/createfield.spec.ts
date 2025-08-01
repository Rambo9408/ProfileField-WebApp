import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createfield } from './createfield';

describe('Createfield', () => {
  let component: Createfield;
  let fixture: ComponentFixture<Createfield>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createfield]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createfield);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
