import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subpanelview } from './subpanelview';

describe('Subpanelview', () => {
  let component: Subpanelview;
  let fixture: ComponentFixture<Subpanelview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subpanelview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subpanelview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
