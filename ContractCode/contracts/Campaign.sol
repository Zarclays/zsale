// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Authority/Ownable.sol";
import "./Confirmations/ConfirmAddress.sol";
import "./OtherSaleDetails.sol";
import "./Payments/Payments.sol";

contract Campaign is Ownable, ConfirmAddress, OtherSaleDetails{
     
     // Creator Address.
     address payable public CreatorAddress;
     
     // Struct Creator data using calldata
     struct CreatorDetails{
         string FirstName;
         string LastName;
         string Country;
         string CoinName;
         string CoinSymbol;
     }
     
     
      mapping(address => CreatorDetails) creators;
      address[] public creatorsAccts;

      constructor(address payable _creatorsadrress) public  {
          CreatorAddress = _creatorsadrress;
      }

      // this is for the creatorDetails to fill Names, Country, Coinname andCoinSymbol. 
      function creatorDetails(address CreatorAddress_, string calldata FirstName_, string calldata LastName_, string calldata Country_, string calldata CoinName_, string calldata CoinSymbol_ ) public {
        
          CreatorDetails storage creation = creators[CreatorAddress_];
          creation.FirstName = FirstName_;
          creation.LastName = LastName_;
          creation.Country = Country_;
          creation.CoinName = CoinName_;
          creation.CoinSymbol = CoinSymbol_;
        
          creatorsAccts.push(CreatorAddress_);
      }
    
      function getCreatorDetails()  public view returns (address[] memory) {
      return creatorsAccts;
      }
    
       function getCreatordetails(address ins) public view returns(string memory, string memory, string memory, string memory, string memory ){
           return(creators[ins].FirstName, creators[ins].LastName, creators[ins].Country, creators[ins].CoinName, creators[ins].CoinSymbol);
       }
    
}