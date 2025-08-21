import { TestBed } from '@angular/core/testing';

import { Contextblockservice } from './contextblockservice';

describe('Contextblockservice', () => {
  let service: Contextblockservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Contextblockservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
