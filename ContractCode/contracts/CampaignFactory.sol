// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";



contract CampaignFactory is Context,Ownable, ReentrancyGuard {

  // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Counters for Counters.Counter;
    // Declare a set state variable
    EnumerableMap.UintToAddressMap private _campaigns;

    Counters.Counter private _counter;

    event CampaignCreated(address creator, address createdCampaignAddress, address tokenAddress);
    
    //  uint ethPrice = 0.15; 

    
    function createNewCampaign(uint256 _loanAmount,address _loanedCurrency, uint _interestRate, uint128 _duration, address _collateralAddress, uint _collateralRatio) public returns(address _loanContractAddress) {

            
            address newCampaign  = address (new CampaignContract(_loanAmount,_loanedCurrency, _duration, _interestRate , _collateralAddress,  _collateralRatio, address(0), msg.sender, LoanContract.LoanStatus.OFFER));

            _counter.increment();
            uint256 ix = _counter.current();

            bool result = _campaigns.set(ix, newCampaign);
            
            emit CampaignCreated(msg.sender, newCampaign, tokenAddress);

            return _loanContractAddress;
    }

    
    function campaignSize() public view returns (uint256) {
        return _campaigns.length();
    }

    

    function contains(uint256 key) public view returns (bool) {
        return _campaigns.contains(key);
    }

        

    function campaignAt(uint256 index) public view returns (uint256 key, address value) {
        return _campaigns.at(index);
    }

    function tryGetCampaignByKey(uint256 key) public view returns (bool, address) {
        return _campaigns.tryGet(key);
    }

}