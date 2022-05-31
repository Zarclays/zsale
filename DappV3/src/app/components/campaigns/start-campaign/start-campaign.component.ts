import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Web3Service } from 'src/app/services/web3.service';

@Component({
  selector: 'app-start-campaign',
  templateUrl: './start-campaign.component.html',
  styleUrls: ['./start-campaign.component.scss']
})
export class StartCampaignComponent implements OnInit {
  campaignId: number|undefined;
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const userChain = params.get('chain');
      this.campaignId = +params.get('campaignId')!;
      if(userChain){
        
        setTimeout(()=>{
          this.web3Service.switchNetworkByChainShortName(userChain).then(()=>{
            
            this.web3Service.connect().then(async ()=>{
              const selectedNetwork = await this.web3Service.getCurrentChainId();
              console.log('loaded chain: ', selectedNetwork)
            });
          });
        },1700)
        
      }
      
    })
    this.titleService.setTitle('Campaign | ZSale');

  }

}
