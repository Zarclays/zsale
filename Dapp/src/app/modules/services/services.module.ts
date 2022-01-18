import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignService, Web3Service } from '.';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    CampaignService,
    Web3Service
  ]
})
export class ServicesModule { }
