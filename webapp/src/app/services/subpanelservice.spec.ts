import { TestBed } from '@angular/core/testing';

import { Subpanelservice } from './subpanelservice';

describe('Subpanelservice', () => {
  let service: Subpanelservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Subpanelservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
