import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panelaction } from './panelaction';

describe('Panelaction', () => {
  let component: Panelaction;
  let fixture: ComponentFixture<Panelaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panelaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panelaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
