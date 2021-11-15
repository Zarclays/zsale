// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Campaign.sol";



contract CampaignFactory is Context,Ownable, ReentrancyGuard {

  // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Counters for Counters.Counter;
    // Declare a set state variable
    EnumerableMap.UintToAddressMap private _campaigns;

    Counters.Counter private _counter;

    mapping(address => mapping (address => uint256 )) public ownersCampaign;

    event CampaignCreated(address indexed creator,uint256 indexed index, address createdCampaignAddress);
    
    uint public campaignCreationPrice = 0.0001 ether; 

    constructor()  {      

    }

    function setCampaignCreationPrice(uint256 newPrice) public onlyOwner{
        campaignCreationPrice=newPrice;
    }

    
    function createNewCampaign(address _tokenAddress,uint _softCap,uint _hardCap, uint256 _saleStartTime, uint256 _saleEndTime,   bool _useWhiteList, Campaign.RefundType _refundType, address _dexRouterAddress,uint _liquidityPercent, uint _listRate, uint _dexListRate) public payable returns(address newCampaignAddress) {

            require(msg.value >= campaignCreationPrice, 'Requires CampaignCreation Price' );
        // address newCampaignAddress  = address (new CampaignContract(_loanAmount,_loanedCurrency, _duration, _interestRate , _collateralAddress,  _collateralRatio, address(0), msg.sender, LoanContract.LoanStatus.OFFER));
        // _tierOneValue, _tierTwoValue, _tierThreeValue, _tierOneUsersValue, _tierTwoUsersValue, _tierThreeUsersValue,

         address newCampaign = address(new Campaign(_tokenAddress, _softCap,_hardCap, _saleStartTime, _saleEndTime,   _useWhiteList, _refundType, _dexRouterAddress,_liquidityPercent, _listRate, _dexListRate));

        _counter.increment();
        uint256 ix = _counter.current();

        bool result = _campaigns.set(ix, newCampaign);        

        ownersCampaign[msg.sender][newCampaign] = ix;

        
        emit CampaignCreated(msg.sender, ix,newCampaign);

        
    }

    function allCampaigns() public view returns (uint256) {
        return _campaigns.length();
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