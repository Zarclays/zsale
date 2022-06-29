import { TestBed } from '@angular/core/testing';

import { CampaignListService } from './campaign-list.service';

describe('CampaignListService', () => {
  let service: CampaignListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CampaignListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
