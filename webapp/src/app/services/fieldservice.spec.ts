import { TestBed } from '@angular/core/testing';

import { Fieldservice } from './fieldservice';

describe('Fieldservice', () => {
  let service: Fieldservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fieldservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
