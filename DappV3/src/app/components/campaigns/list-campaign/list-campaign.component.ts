import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Web3Service } from '../../../services/web3.service';
import { ActivatedRoute, ParamMap, Router, Params } from '@angular/router'
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';
import {HttpParams} from '@angular/common/http';
import {ethers, utils} from 'ethers';
import contractList from '../../../models/contract-list';
import { NgxSpinnerService } from "ngx-spinner";
import { CampaignListService } from 'src/app/components/campaigns/campaign-list.service';

@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['./list-campaign.component.scss']
})
export class ListCampaignComponent implements OnInit {
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';
  nativeCoin: {
    name: string;
    symbol: string;
    decimals: number;
  } | undefined;

  campaignListContract: ethers.Contract;
  campaigns : {key: string,address: string}[] =[];

  campaignCount = 48;
  currentChainId: any;

  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private campaignListService: CampaignListService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.route.params.subscribe((params: Params) => {
      this.userChain = params['chain'];
      
      this.web3ServiceConnect$ = this.web3Service.onConnectChange.subscribe(async (connected: boolean)=>{
        
        if(connected){
           if(this.userChain && this.userChain!='d' ){
            await this.web3Service.switchNetworkByChainShortName(this.userChain); 
          }else{
            this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';
            this.updateURLWithNewParamsWithoutReloading()
          }

          this.currentChainId = await this.web3Service.getCurrentChainId();
          this.nativeCoin = (await this.web3Service.getCurrentChain())?.nativeCurrency;

          this.campaignListContract = await this.campaignListService.getCampaignListContract(contractList[this.currentChainId].campaignList)

          const count = await this.campaignListContract.campaignSize();

          this.campaignCount = Math.min(this.campaignCount, +count);
          this.spinner.show();

          await Promise.all(
            Array(this.campaignCount)
              .fill(undefined)
              .map(async (element, index) => {
                const result = await this.campaignListContract.campaignAt(index);
                if(result){
                  this.campaigns.push({
                    key: result.key.toString(),
                    address: result.value
                  })
                  
                }
                
              })
          );

          this.spinner.hide();
        }
        
            
      })
      
    })

    

    this.titleService.setTitle('All Campaigns | ZSale');

  }

  updateURLWithNewParamsWithoutReloading() {
    // const params = new HttpParams().appendAll({
        
    //     chain: this.userChain!
    // });

    // this.location.replaceState(
    //     location.pathname,
    //     params.toString()
    // );

    const url = this.router.createUrlTree(['campaigns', this.userChain, 'list']).toString()

    this.location.go(url);
  }


  
  ngOnDestroy(){
    this.web3ServiceConnect$!.unsubscribe();
  }


}
