import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCampaignComponent } from './list-campaign/list-campaign.component';
import { StartCampaignComponent } from './start-campaign/start-campaign.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Campaigns'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
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
    ]
  }

  // { path: '', component: ListCampaignComponent , canActivate: [] , data: {
  //     title: 'Campaigns'
  //   }
  // },
  // { path: ':chain/list', component: ListCampaignComponent , canActivate: [], data: {
  //     title: 'Campaigns'
  //   }
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule { }
