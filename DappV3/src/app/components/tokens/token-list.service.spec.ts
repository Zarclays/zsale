import { TestBed } from '@angular/core/testing';

import { TokenListService } from './token-list.service';

describe('TokenListService', () => {
  let service: TokenListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
