import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fielddetails } from './fielddetails';

describe('Fielddetails', () => {
  let component: Fielddetails;
  let fixture: ComponentFixture<Fielddetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fielddetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fielddetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
