import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/modules/services/campaign.service';



@Component({
  selector: 'launchpad-list',
  templateUrl: './launchpad-list.component.html',
  styleUrls: ['./launchpad-list.component.scss']
})
export class LaunchpadListComponent implements OnInit {

  constructor(private campaignService: CampaignService) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.campaignService.getCampaignList().then(()=>{
      
      })
    }, 3000);
  }

}
