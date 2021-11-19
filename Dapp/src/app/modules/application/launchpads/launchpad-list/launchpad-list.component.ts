import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/modules/services/campaign.service';



@Component({
  selector: 'launchpad-list',
  templateUrl: './launchpad-list.component.html',
  styleUrls: ['./launchpad-list.component.scss']
})
export class LaunchpadListComponent implements OnInit {
  list: any[] = [];
  loadingList = true;
  //ts-ignore
  baseTokenSymbol :string;

  constructor(private campaignService: CampaignService) {

    this.baseTokenSymbol = this.campaignService.web3Service.baseTokenSymbol;
  }

  ngOnInit() {
    setTimeout(async ()=>{

      let list = await this.campaignService.getCampaignList();
      this.loadingList = false;
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        this.list.push(element );
      }
      


    //   campaigns = await Promise.all(
    //   Array(parseInt(campaignsCount))
    //     .fill()
    //     .map((element, index) => {
    //       return factory.methods.getDeployedCampaign(index).call();
    //     })
    // );

      // await this.campaignService.getCampaign(list[0].value);
    }, 2500);
  }

}
