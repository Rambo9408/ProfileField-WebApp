import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Midheader } from './midheader';

describe('Midheader', () => {
  let component: Midheader;
  let fixture: ComponentFixture<Midheader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Midheader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Midheader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
