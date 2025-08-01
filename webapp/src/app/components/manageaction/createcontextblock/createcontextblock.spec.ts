import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createcontextblock } from './createcontextblock';

describe('Createcontextblock', () => {
  let component: Createcontextblock;
  let fixture: ComponentFixture<Createcontextblock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createcontextblock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Createcontextblock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
