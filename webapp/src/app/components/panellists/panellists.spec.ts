import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Panellists } from './panellists';

describe('Panellists', () => {
  let component: Panellists;
  let fixture: ComponentFixture<Panellists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Panellists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Panellists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
