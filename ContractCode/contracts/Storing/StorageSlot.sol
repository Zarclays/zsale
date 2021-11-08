// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract StorageSlot{
    
    //token attributes
  string public  NAME; //name of the contract
  uint public  maxCap; // Max cap in BNB
  uint256 public  saleStartTime; // start sale time
  uint256 public  saleEndTime; // end sale time
  uint256 public totalBnbReceivedInAllTier; // total bnd received
  uint256 public totalBnbInTierOne; // total bnb for tier one
  uint256 public totalBnbInTierTwo; // total bnb for tier Tier
  uint256 public totalBnbInTierThree; // total bnb for tier Three
  uint public totalparticipants; // total participants in ido
  address payable public projectOwner; // project Owner
  
   // max cap per tier
  uint public tierOneMaxCap;
  uint public tierTwoMaxCap;
  uint public tierThreeMaxCap;
  
  //total users per tier
  uint public totalUserInTierOne;
  uint public totalUserInTierTwo;
  uint public totalUserInTierThree;
  
  //max allocations per user in a tier
  uint public maxAllocaPerUserTierOne;
  uint public maxAllocaPerUserTierTwo; 
  uint public maxAllocaPerUserTierThree;
 
  // address array for tier one whitelist
  address[] private whitelistTierOne; 
  
  // address array for tier two whitelist
  address[] private whitelistTierTwo; 
  
  // address array for tier three whitelist
  address[] private whitelistTierThree; 
  

  //mapping the user purchase per tier
  mapping(address => uint) public buyInOneTier;
  mapping(address => uint) public buyInTwoTier;
  mapping(address => uint) public buyInThreeTier;
  

}