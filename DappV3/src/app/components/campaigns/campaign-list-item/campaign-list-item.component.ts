import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { CampaignService } from 'src/app/components/campaigns/campaign.service';
import { Campaign } from 'src/app/models/campaign';
import contractList from 'src/app/models/contract-list';
import {getDateFromEther, formatEtherDateToJs, formatDateToJsString} from 'src/app/utils/date';
import {formatPercent} from 'src/app/utils/numbers'
import {ethers, utils} from 'ethers';

@Component({
  selector: 'campaign-list-item',
  templateUrl: './campaign-list-item.component.html',
  styleUrls: ['./campaign-list-item.component.scss']
})
export class CampaignListItemComponent implements OnInit {

  @Input() campaignId: string='';
  @Input() campaignAddress: string='';
  @Input() currentChainId: string='';
  @Input() chainName: string = '';
  @Input() nativeCoin: {
    name: string;
    symbol: string;
    decimals: number;
  }| undefined = undefined;
  
  now = Date.now();
  campaign: Campaign;
  saleProgress: any;

  constructor(public web3Service: Web3Service,
    private campaignService: CampaignService) { }

  async ngOnInit() {
    this.campaign = await this.campaignService.getCampaignDetails(contractList[this.currentChainId].campaignList, this.campaignId!, this.nativeCoin!.decimals);

    const amount = parseFloat( this.campaign.totalCoinReceived ) ;
    const hardCap = parseFloat( this.campaign.hardCap );
    const softCap = parseFloat( this.campaign.softCap );

    this.saleProgress = 100 * Math.min( amount/softCap ,  amount/ hardCap)
    if(this.saleProgress==100){
      this.saleProgress = 100 * amount/ hardCap;
    }
  }

}
