// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// This is where to store other details like SaleTime, WhiteList e.t.c.
contract OtherSaleDetails{

    uint256 public immutable saleStartTime;
    uint256 public immutable saleEndTime;
    uint256 public immutable SoftCap;
    uint256 public immutable HardCap;
    uint256 public totalParticipant;
    bool public WhitelistEnabled;

    address[] private whitelist;
    mapping(address => uint) buy;
    address[] public totaParticipants;


   constructor(uint256 __saleStartTime, uint256 _saleEndTime, uint256 _softCap, uint256 _Hardcap) public {
       saleStartTime = __saleStartTime;
       saleEndTime = _saleEndTime;
       SoftCap = _softCap;
       HardCap = _Hardcap;
       totalParticipant = totaParticipants;
   }

}