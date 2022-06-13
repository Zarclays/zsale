import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { StartCampaignComponent } from './start-campaign/start-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { ArchwizardModule } from 'angular-archwizard';
import { FormModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonGroupModule } from '@coreui/angular';


@NgModule({
  declarations: [
    ListCampaignComponent,
    StartCampaignComponent,
    CampaignDetailsComponent
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    ArchwizardModule,
    FormModule,
    ReactiveFormsModule,
    ButtonGroupModule
  ]
})
export class CampaignsModule { }
