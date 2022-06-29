import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Web3Service } from '../../../services/web3.service';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Subscription } from 'rxjs';

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
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userChain = params.get('chain');
      this.web3ServiceConnect$ = this.web3Service.onConnect.subscribe(async ()=>{
      
        if(this.userChain ){
          await this.web3Service.switchNetworkByChainShortName(this.userChain); 
        }
            
      })
      
    })

    

    this.titleService.setTitle('Campaigns | ZSale');

  }


  
  ngOnDestroy(){
    this.web3ServiceConnect$!.unsubscribe();
  }


}
