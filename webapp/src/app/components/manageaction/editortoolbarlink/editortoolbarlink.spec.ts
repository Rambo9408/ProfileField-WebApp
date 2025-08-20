import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editortoolbarlink } from './editortoolbarlink';

describe('Editortoolbarlink', () => {
  let component: Editortoolbarlink;
  let fixture: ComponentFixture<Editortoolbarlink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editortoolbarlink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editortoolbarlink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
