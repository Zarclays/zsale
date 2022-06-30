import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Web3Service } from 'src/app/services/web3.service';
import { CampaignService } from 'src/app/components/campaigns/campaign.service';
import { Campaign } from 'src/app/models/campaign';
import contractList from 'src/app/models/contract-list';
import {getDateFromEther, formatEtherDateToJs} from 'src/app/utils/date';
import {formatPercent} from 'src/app/utils/numbers'
import {utils} from 'ethers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.scss']
})
export class CampaignDetailsComponent implements OnInit {
  mainFormGroup!: FormGroup;
  campaignId: string|undefined;
  campaign: Campaign|undefined;
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';

  isOpenForPayment = false;
  isOwner = false;

  nativeCoin: {
    name: string;
    symbol: string;
    decimals: number;
  }| undefined;

  validationMessages : {
    [index: string]: any
   } = {
    'amount': {
      'required'  :   'Amount is Required.',
      'min': 'Amount must be at least 0 ',
      'max': 'Amount must be at most 100 '
    }
 
   };
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private fb: FormBuilder) {
      
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userChain = params.get('chain');
      this.campaignId = params.get('campaignId')!;
      
      this.web3ServiceConnect$ = this.web3Service.onConnect.subscribe(async ()=>{
      
        if(this.userChain ){
          await this.web3Service.switchNetworkByChainShortName(this.userChain); 
        }

        const currentChainId = await this.web3Service.getCurrentChainId();
        this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;
      
        this.campaign = await this.campaignService.getCampaignDetails(contractList[currentChainId].campaignList, this.campaignId!);

        this.mainFormGroup = this.fb.group({
        
          amount: ['', [Validators.required,Validators.min(+this.formatUnits( this.campaign.minAllocationPerUser,this.nativeCoin.decimals) ),Validators.max(+this.formatUnits(  this.campaign.maxAllocationPerUserTierTwo,this.nativeCoin.decimals)  )]],
    
        })

        this.validationMessages['amount'].min = `Amount must be at least ${this.formatUnits(  this.campaign.minAllocationPerUser,this.nativeCoin.decimals)} `
        this.validationMessages['amount'].max = `Amount must be at most ${this.formatUnits(  this.campaign.maxAllocationPerUserTierTwo,this.nativeCoin.decimals)} `


        this.isOpenForPayment = getDateFromEther( this.campaign.saleStartTime).getTime() < Date.now() && getDateFromEther( this.campaign.saleEndTime).getTime() > Date.now() ;
        
        this.isOwner = this.web3Service.accounts.findIndex(f=>f==this.campaign?.owner??'none')>=0;
            
      })
      
    })

    


    this.titleService.setTitle('Participate in Campaign | ZSale');

  }

  formatEtherDateToJs(value: any){
    return formatEtherDateToJs(value);
  }

  formatUnits(value: any, decimals: number){
    return utils.formatUnits(value, decimals);
  }

  formatPercent(value: any){
    return formatPercent(value);
  }

  

  ngOnDestroy(){
    this.web3ServiceConnect$!.unsubscribe();
  }



  async submitBid(){

  }

  objectKeys(o: any){
    if(!o){
      return []
    }
    return Object.keys(o)
  }

}
