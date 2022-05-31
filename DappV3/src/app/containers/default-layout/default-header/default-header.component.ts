import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Web3Service } from 'src/app/services/web3.service';

import { getAllChains } from 'evm-chains';
import getSupportedChains from '../../../models/supported-chains';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  @Input() sidebarId: string = "sidebar";
  networkList = getSupportedChains();
  selectedNetwork: any=""; 


  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService,
    public web3Service: Web3Service) {
    super();

    
    
  }

  ngOnInit(): void {
    this.selectedNetwork = 83;

    this.web3Service.switchNetworkByChainId(this.selectedNetwork);

    this.web3Service.connect().then(async ()=>{
      this.selectedNetwork = await this.web3Service.getCurrentChainId();
      console.log('loaded chin: ', this.selectedNetwork)
    });
  }

  onSwitchNetwork(newNetwork: any){
    this.selectedNetwork = newNetwork;
    console.log('sicthed to ', newNetwork, ', sel: ', this.selectedNetwork)
    this.web3Service.switchNetworkByChainId(this.selectedNetwork);
  }

  async connect (){
    console.log('connecting')
    await this.web3Service.connect();
    console.log('connected')
  }
}
