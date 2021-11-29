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
  campaignFactoryAddress : string = '0x7144b544d9F49F46A1d2fe4EdBe9538fAD806310';
  createCampaignFee = "0.002"; 

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
    let dexRouterAddress = await campaignContract.methods.dexRouterAddress().call();
    // let dexRouterAddress = await campaignContract.methods.dexRouterAddress().call();


    console.log('tokenInfo: ', tokenInfo );
    let result = { ...info, ...other, 
      saleAddress: address,
      name: await tokenInfo.methods.name().call(),
      symbol: await tokenInfo.methods.symbol().call(), 
      decimals: await tokenInfo.methods.decimals().call(), 
      totalSupply: await tokenInfo.methods.totalSupply().call(),
      dexRouterAddress: dexRouterAddress 
    }
    result.hardCap = Web3.utils.fromWei(result.hardCap.toString());
    result.softCap = Web3.utils.fromWei(result.softCap.toString());
    result.saleStartTime= this.timestampToDate(result.saleStartTime);
    result.saleEndTime= this.timestampToDate(result.saleEndTime);
    
    return result;
  }

  public async getCampaignTotalCoinReceived(address: string){
    const campaignContract = this.getCampaignContract(address);
    // myContract.methods.myMethod([arguments]).call()

    return await campaignContract.methods.totalCoinReceived().call();
    
  }

  public async getCampaignByIndex(index: number){
    //campaignAt
    const campaignFactory = this.getCampaignFactoryContract();
    
    let campaignAddress = await campaignFactory.methods.campaignAt(index).call();
    
    if(campaignAddress && campaignAddress.value){
      const campaign = await this.getCampaignByAddress(campaignAddress.value);

      campaign.minbuy=0.1;
      campaign.maxbuy=10;
      return campaign;
    }
    
    return null;
  }


  public  createCampaign(senderAddress: any, tokenAddress: string,_softCap: number,_hardCap: number, _saleStartTime: any, _saleEndTime: any, _refundType: any,  _dexRouterAddress: string,_liquidityPercent: number, _listRate: number,  _dexListRate: number,   _useWhiteList = false){
    const campaignFactory = this.getCampaignFactoryContract();
    console.log('returned:',tokenAddress,_softCap,_hardCap, _saleStartTime, _saleEndTime,   _useWhiteList, _refundType, _dexRouterAddress,_liquidityPercent, _listRate, _dexListRate);

    

    

    return campaignFactory.methods.createNewCampaign(tokenAddress, Web3.utils.toWei(_softCap.toString(), 'ether') , Web3.utils.toWei(_hardCap.toString(), 'ether') , this.dateToTimeStamp(_saleStartTime), this.dateToTimeStamp(_saleEndTime),   _useWhiteList, _refundType, _dexRouterAddress,_liquidityPercent, _listRate, _dexListRate).send({
      value: Web3.utils.toWei(this.createCampaignFee, 'ether') ,
      from: senderAddress
    });
    
  }

  public  submitBid(senderAddress: any, saleAddress: string,amount: string){
    // const campaignContract = this.getCampaignContract(saleAddress);
    // console.log(`Sender: ${senderAddress} , Amount: ${amount}`)

    // return campaignContract.methods.submitBid().send({
    //   value: Web3.utils.toWei(amount.toString() , 'ether') ,
    //   from: senderAddress
    // });

    let web3 = this.web3Service.web3;
    return web3.eth.sendTransaction({
      value: Web3.utils.toWei(amount.toString(), 'ether') ,
      from: senderAddress,
      to: saleAddress
    });


    
    
  }


  dateToTimeStamp(dt: Date){

    let d = dt.getTime();
    let dateInUnixTimestamp = Math.floor( d / 1000 );

    return dateInUnixTimestamp;
  }

  timestampToDate(timestamp: number|string){
    let t = +timestamp;

    return new Date(t * 1000);
  }



}
