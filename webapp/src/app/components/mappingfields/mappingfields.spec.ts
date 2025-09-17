import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mappingfields } from './mappingfields';

describe('Mappingfields', () => {
  let component: Mappingfields;
  let fixture: ComponentFixture<Mappingfields>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mappingfields]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mappingfields);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
