import { Injectable } from '@angular/core';
import {Web3Service} from './web3.service';
const Web3 = require('web3');
const CampaignFactoryAbiJSON = require('../../../assets/CampaignFactory.json')

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  campaignFactoryAddress : string = '0x37fb659EE40fAfDD1573c3DFde81b94Bf389457b';

  constructor(public web3Service: Web3Service) { 


  }

  public getCampaignFactoryContract () {
    const web3 = this.web3Service.web3;
    const cFactoryContract = new web3.eth.Contract(
      CampaignFactoryAbiJSON.abi,
      this.campaignFactoryAddress
    );
    return cFactoryContract;
  }

  public async getCampaignList(){
    const campaignFactory = this.getCampaignFactoryContract();
    // myContract.methods.myMethod([arguments]).call()

    let length = await campaignFactory.methods.campaignSize().call();
    console.log('Length: ', length );
    
    var r = [];
    for (let index = 0; index < length; index++) {
      const element = await campaignFactory.methods.campaignAt(index).call();
      console.log('element: ', element );
      r.push({key:element.key, value:element.value});
    }
    console.log('r: ', r );
    return r;
  }



}
