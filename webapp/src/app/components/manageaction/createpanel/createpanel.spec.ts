import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createpanel } from './createpanel';

describe('Createpanel', () => {
  let component: Createpanel;
  let fixture: ComponentFixture<Createpanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createpanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createpanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
