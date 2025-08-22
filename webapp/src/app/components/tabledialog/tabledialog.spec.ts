import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tabledialog } from './tabledialog';

describe('Tabledialog', () => {
  let component: Tabledialog;
  let fixture: ComponentFixture<Tabledialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabledialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabledialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
