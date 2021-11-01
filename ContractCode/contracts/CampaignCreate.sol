// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./ConfirmAddress.sol";

contract CampaignCreate is ConfirmAddress, Ownable{
    
    address admin;
    
    string private creatorName;
    string private coinName;
    string private coinSymbol;
    
    uint256 private totalCoinAvailable;
    uint256 public coin_amount_to_1Ether = 100000001;
    
    
    constructor(address _adnin, string memory _creatorName, string memory _coinName, string memory _coinSymbol) public payable{
        admin = _adnin;
        creatorName = _creatorName;
        coinName = _coinName;
        coinSymbol = _coinSymbol;
    }
    
    function getCampaignInfo() public view returns(string memory, string memory, string memory){
        return (creatorName, coinName, coinSymbol);
    }
}