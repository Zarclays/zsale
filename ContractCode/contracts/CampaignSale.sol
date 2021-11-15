// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./TokenExample.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/token/ERC20/utils/TokenTimelock.sol";


contract CampaignSale{
    
    address admin;
    
    TokenExample public tokencontract;
    
    function CampaignSales(TokenExample  _tokenContract) public {
        
        // Assign An Admin
        admin = msg.sender;
        tokencontract = _tokenContract;
        
        //Token Contracts
        
        
        //Token Price 
    }
}