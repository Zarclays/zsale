import { Injectable } from '@angular/core';
import {Web3Service} from './web3.service';
const Web3 = require('web3');
const CampaignFactoryAbiJSON = require('../../../assets/CampaignFactory.json');
const CampaignAbiJSON = require('../../../assets/Campaign.json');
const ERC20AbiJSON = require('../../../assets/ERC20.json');

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  campaignFactoryAddress : string = '0xd12d5237c15ae556dA3564A9F9F8beCAfE85C617';

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

  public getCampaignContract (address: string) {
    const web3 = this.web3Service.web3;
    const cContract = new web3.eth.Contract(
      CampaignAbiJSON.abi,
      address
    );
    return cContract;
  }

  public getERC20Contract (address: string) {
    const web3 = this.web3Service.web3;
    const cContract = new web3.eth.Contract(
      ERC20AbiJSON.abi,
      address
    );
    return cContract;
  }


  public async getCampaignList(){
    const campaignFactory = this.getCampaignFactoryContract();
    // myContract.methods.myMethod([arguments]).call()

    let campaignsCount = await campaignFactory.methods.campaignSize().call();
    console.log('Length: ', campaignsCount );
    
    // var r = [];
    // for (let index = 0; index < length; index++) {
    //   const element = await campaignFactory.methods.campaignAt(index).call();
      
    //   r.push({key:element.key, value:element.value});
    // }
    
    // return r;
    let campaigns = await Promise.all(
        Array(parseInt(campaignsCount))
          .fill(undefined)
          .map(async (element, index) => {
            let r =  await this.getCampaignByIndex(index);
            r.index = index ;
            return r;
          })
      );

    return campaigns;
      
  }


  public async getCampaignByAddress(address: string){
    const campaignContract = this.getCampaignContract(address);
    // myContract.methods.myMethod([arguments]).call()

    let info = await campaignContract.methods.saleInfo().call();
    
    let other = await campaignContract.methods.otherInfo().call();
    
    let tokenInfo = await this.getERC20Contract(info.tokenAddress);
    console.log('tokenInfo: ', tokenInfo );
    let result = { ...info, ...other, 
      name: await tokenInfo.methods.name().call(),
      symbol: await tokenInfo.methods.symbol().call(), 
      decimals: await tokenInfo.methods.decimals().call(), 
      totalSupply: await tokenInfo.methods.totalSupply().call() 
    }
    console.log('result: ', result );

    return result;
  }

  public async getCampaignByIndex(index: number){
    //campaignAt
    const campaignFactory = this.getCampaignFactoryContract();
    
    let campaignAddress = await campaignFactory.methods.campaignAt(index).call();
    if(campaignAddress && campaignAddress.value){
      const campaign = this.getCampaignByAddress(campaignAddress.value);
      return campaign;
    }
    
    return null;
  }



}
