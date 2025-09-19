import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatedaccountpage } from './updatedaccountpage';

describe('Updatedaccountpage', () => {
  let component: Updatedaccountpage;
  let fixture: ComponentFixture<Updatedaccountpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatedaccountpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatedaccountpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
