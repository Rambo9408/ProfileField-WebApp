import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panelpage } from './panelpage';

describe('Panelpage', () => {
  let component: Panelpage;
  let fixture: ComponentFixture<Panelpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panelpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panelpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
