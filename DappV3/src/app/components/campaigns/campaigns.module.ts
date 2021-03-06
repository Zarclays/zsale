import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignsRoutingModule } from './campaigns-routing.module';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { StartCampaignComponent } from './start-campaign/start-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { ArchwizardModule } from 'angular-archwizard';
import { FormModule, ProgressModule, ToastModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonGroupModule } from '@coreui/angular';
import {DpDatePickerModule} from 'ng2-date-picker';
import { TooltipModule } from '@coreui/angular';
import { NgxSimpleCountdownModule } from 'ngx-simple-countdown';
import { ModalModule } from '@coreui/angular';
import { CampaignListItemComponent } from './campaign-list-item/campaign-list-item.component';
import { AvatarModule } from '@coreui/angular';
import { HttpClientModule } from '@angular/common/http';
// import { CardModule } from '@coreui/angular';
// import { GridModule } from '@coreui/angular';

@NgModule({
  declarations: [
    ListCampaignComponent,
    StartCampaignComponent,
    CampaignDetailsComponent,
    CampaignListItemComponent 
  ],
  imports: [
    CommonModule,
    CampaignsRoutingModule,
    ArchwizardModule,
    FormModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    DpDatePickerModule ,
    ProgressModule,
    ToastModule,
    TooltipModule,
    NgxSimpleCountdownModule,
    ModalModule,
    AvatarModule,
    HttpClientModule 
    // CardModule,
    // GridModule
  ]
})
export class CampaignsModule { }
