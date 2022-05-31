import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Web3Service } from '../../../services/web3.service';
import { ActivatedRoute, ParamMap } from '@angular/router'

@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['./list-campaign.component.scss']
})
export class ListCampaignComponent implements OnInit {
  
  constructor(private titleService: Title, 
    public web3Service: Web3Service,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const userChain = params.get('chain');
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
    this.titleService.setTitle('Campaigns | ZSale');

  }


}
