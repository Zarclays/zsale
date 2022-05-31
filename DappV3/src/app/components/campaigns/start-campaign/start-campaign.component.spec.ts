import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartCampaignComponent } from './start-campaign.component';

describe('StartCampaignComponent', () => {
  let component: StartCampaignComponent;
  let fixture: ComponentFixture<StartCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartCampaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
