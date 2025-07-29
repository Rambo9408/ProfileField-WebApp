import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panelview } from './panelview';

describe('Panelview', () => {
  let component: Panelview;
  let fixture: ComponentFixture<Panelview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panelview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panelview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
