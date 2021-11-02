// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "@openzeppelin/contracts/utils/StorageSlot.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "./ConfirmAddress.sol";
import "./StorageSlot.sol";

contract Campaign is ConfirmAddress, Ownable{
    
     using StorageSlot for *;
    
    address admin;
    
    string private creatorName;
    string private coinName;
    string private coinSymbol;
    
    uint256 private totalCoinAvailable;
    uint256 public coin_amount_to_1Ether = 100000001;
    
    
    constructor(address _admin, string memory _creatorName, string memory _coinName, string memory _coinSymbol, uint256 _coin_to_ether) public payable{
        admin = _admin;
        creatorName = _creatorName;
        coinName = _coinName;
        coinSymbol = _coinSymbol;
        coin_amount_to_1Ether = _coin_to_ether;
    }
    
    
}