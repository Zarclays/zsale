import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Web3Service } from '../../../services/web3.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';
import {HttpParams} from '@angular/common/http'

@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['./list-campaign.component.scss']
})
export class ListCampaignComponent implements OnInit {
  web3ServiceConnect$: Subscription|undefined;
  userChain: string|null = 'mtrt';
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userChain = params.get('chain');
      this.web3ServiceConnect$ = this.web3Service.onConnect.subscribe(async ()=>{
      
        if(this.userChain && this.userChain!='d' ){
          await this.web3Service.switchNetworkByChainShortName(this.userChain); 
        }else{
          this.userChain = (await this.web3Service.getCurrentChain())?.chain??'';
          this.updateURLWithNewParamsWithoutReloading()
        }
            
      })
      
    })

    

    this.titleService.setTitle('Campaigns | ZSale');

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
