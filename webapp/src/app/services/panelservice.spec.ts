import { TestBed } from '@angular/core/testing';

import { Panelservice } from './panelservice';

describe('Panelservice', () => {
  let service: Panelservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Panelservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
