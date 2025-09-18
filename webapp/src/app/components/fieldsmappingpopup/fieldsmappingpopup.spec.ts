import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fieldsmappingpopup } from './fieldsmappingpopup';

describe('Fieldsmappingpopup', () => {
  let component: Fieldsmappingpopup;
  let fixture: ComponentFixture<Fieldsmappingpopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fieldsmappingpopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fieldsmappingpopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
