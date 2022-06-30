import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { StartCampaignComponent } from './start-campaign/start-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'd/list'
  },
  {
    path: 'd/list',
    component: ListCampaignComponent,
    data: {
      title: 'All Campaigns'
    }
  },
  {
    path: 'start',
    component: StartCampaignComponent,
    data: {
      title: 'Start Campaign'
    }
  },
  {
    path: ':chain/list',
    component: ListCampaignComponent,
    data: {
      title: 'All Campaigns'
    }
  },
  {
    path: ':chain/p/:campaignId',
    component: CampaignDetailsComponent,
    data: {
      title: 'Participate'
    }
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule { }
