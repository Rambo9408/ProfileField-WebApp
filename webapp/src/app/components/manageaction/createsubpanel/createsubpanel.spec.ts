import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createsubpanel } from './createsubpanel';

describe('Createsubpanel', () => {
  let component: Createsubpanel;
  let fixture: ComponentFixture<Createsubpanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createsubpanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createsubpanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
