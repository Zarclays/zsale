import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from '../../../app/services/web3.service';
import { Campaign } from '../../../app/models/campaign';
import { CampaignListService } from './campaign-list.service';
const CampaignAbi = require('../../../assets/Campaign.json');
import {utils} from 'ethers';
import {getDateFromEther, formatEtherDateToJs} from '../../../app/utils/date';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(public web3Service: Web3Service,
    public campaignListService: CampaignListService) { 
    
  }

  public getCampaignContract (address: string) {
    
    const cContract = new ethers.Contract(address, CampaignAbi, this.web3Service.ethersProvider);
    return cContract;
  }

  public getCampaignContractWithSigner (address: string) {
    
    const cContract = new ethers.Contract(address, CampaignAbi, this.web3Service.ethersSigner);
    return cContract;
  }

  public async getCampaignDetails (campaignListaddress: string, campaignId: string, decimals: number = 18): Promise<Campaign> { //decimals is nativecoin decimals
    const listContract = this.campaignListService.getCampaignListContract(campaignListaddress); 
    const [success,cmpAddress] = await listContract.tryGetCampaignByKey(campaignId);

    const campaignContract = this.getCampaignContractWithSigner(cmpAddress);

    /* uint256 softcap, uint256 hardcap,uint256 saleStartTime, uint256 saleEndTime,uint256 listRate, uint256 dexListRate, uint liquidity,uint _liquidityReleaseTime ,uint256 totalCoins, uint256 totalParticipant, bool useWhiteList, bool hasKyc, bool isAuditd */
    let cmp = await campaignContract.getCampaignInfo();

    let liquidityReleaseTime = cmp._liquidityReleaseTime;
    let tokenAddress = (await campaignContract.saleInfo()).tokenAddress;

    const tokenContract = this.web3Service.getERC20Contract(tokenAddress);
    const name = await tokenContract.name();
    const symbol = await tokenContract.symbol();
    const totalSupply = await tokenContract.totalSupply();

    let minAllocationPerUser= await campaignContract.minAllocationPerUser();
    let maxAllocationPerUserTierOne= await campaignContract.maxAllocationPerUserTierOne();
    let maxAllocationPerUserTierTwo= await campaignContract.maxAllocationPerUserTierTwo();

    const otherInfo = await campaignContract.otherInfo();
    const logoUrl = otherInfo.logoUrl;
    const hasKYC = otherInfo.hasKYC;
    const isAudited = otherInfo.isAudited;
    const totalCoinReceived = await campaignContract.totalCoinReceived();
    const owner = await campaignContract.owner();
    
    
    

    return {
        softCap: utils.formatUnits( cmp.softcap,decimals),
        hardCap: utils.formatUnits( cmp.hardcap,decimals),
        saleStartTime: getDateFromEther(cmp.saleStartTime),
        saleEndTime: getDateFromEther(cmp.saleEndTime),
        listRate: cmp.listRate,
        dexListRate: cmp.dexListRate,
        liquidity: cmp.liquidity,
        liquidityReleaseTime, 
        totalParticipant: cmp.totalParticipant,
        useWhiteList: cmp.useWhiteList,

        saleAddress: cmpAddress, 
        name,
        symbol,
        totalSupply,            
        tokenAddress,  
        
        minAllocationPerUser: utils.formatUnits(minAllocationPerUser,decimals),
        maxAllocationPerUserTierOne: utils.formatUnits(maxAllocationPerUserTierOne,decimals) ,
        maxAllocationPerUserTierTwo: utils.formatUnits(maxAllocationPerUserTierTwo,decimals),
        campaignAddress: cmpAddress,
        logoUrl,
        hasKYC,
        isAudited,
        totalCoinReceived : utils.formatUnits( totalCoinReceived??'0' ,decimals) ,
        owner
    };

  }
}
