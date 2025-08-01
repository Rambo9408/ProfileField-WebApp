import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Managecustomfields } from './managecustomfields';

describe('Managecustomfields', () => {
  let component: Managecustomfields;
  let fixture: ComponentFixture<Managecustomfields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Managecustomfields]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Managecustomfields);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
