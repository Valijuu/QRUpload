import { TestBed } from '@angular/core/testing';

import { WeddingprosService } from './weddingpros-service';

describe('WeddingprosService', () => {
  let service: WeddingprosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeddingprosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
