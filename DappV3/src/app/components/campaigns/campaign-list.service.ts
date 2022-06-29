import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from '../../../app/services/web3.service';
const CampaignListAbi = require('../../../assets/CampaignList.json');

@Injectable({
  providedIn: 'root'
})
export class CampaignListService {

  constructor(public web3Service: Web3Service) { 
    
  }

  public getCampaignListContract (address: string) {
    
    const cContract = new ethers.Contract(address, CampaignListAbi, this.web3Service.ethersProvider);
    return cContract;
  }

  public getCampaignListContractWithSigner (address: string) {
    
    const cContract = new ethers.Contract(address, CampaignListAbi, this.web3Service.ethersSigner);
    return cContract;
  }
}
