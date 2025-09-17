import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fieldstoimport } from './fieldstoimport';

describe('Fieldstoimport', () => {
  let component: Fieldstoimport;
  let fixture: ComponentFixture<Fieldstoimport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fieldstoimport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fieldstoimport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
