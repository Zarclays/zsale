import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { CampaignService } from 'src/app/components/campaigns/campaign.service';
import { Campaign } from 'src/app/models/campaign';
import contractList from 'src/app/models/contract-list';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {

  campaignId: string|undefined;
  campaign: Campaign|undefined;
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';

  nativeCoin = "ETH";
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userChain = params.get('chain');
      this.campaignId = params.get('campaignId')!;
      
      this.web3ServiceConnect$ = this.web3Service.onConnect.subscribe(async ()=>{
      
        if(this.userChain ){
          await this.web3Service.switchNetworkByChainShortName(this.userChain); 
        }

        const currentChainId = await this.web3Service.getCurrentChainId();
        this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency.symbol??'Coin';
      
        this.campaign = await this.campaignService.getCampaignDetails(contractList[currentChainId].campaignList, this.campaignId!);
            
      })


      
    })

    


    this.titleService.setTitle('Participate in Campaign | ZSale');

  }



  ngOnDestroy(){
    this.web3ServiceConnect$!.unsubscribe();
  }

}
