import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignListItemComponent } from './campaign-list-item.component';

describe('CampaignListItemComponent', () => {
  let component: CampaignListItemComponent;
  let fixture: ComponentFixture<CampaignListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
