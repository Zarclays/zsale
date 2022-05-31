import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { StartCampaignComponent } from './start-campaign/start-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';


@NgModule({
  declarations: [
    ListCampaignComponent,
    StartCampaignComponent,
    CampaignDetailsComponent
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule
  ]
})
export class CampaignsModule { }
