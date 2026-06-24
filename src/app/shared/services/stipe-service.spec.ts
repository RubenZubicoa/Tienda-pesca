import { TestBed } from '@angular/core/testing';

import { StipeService } from './stipe-service';

describe('StipeService', () => {
  let service: StipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
