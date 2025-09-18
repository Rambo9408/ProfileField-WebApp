import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mappingpreview } from './mappingpreview';

describe('Mappingpreview', () => {
  let component: Mappingpreview;
  let fixture: ComponentFixture<Mappingpreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mappingpreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mappingpreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
