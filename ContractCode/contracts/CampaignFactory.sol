// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Campaign.sol";



contract CampaignFactory is Context,Ownable /*, ReentrancyGuard */ {

  // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Counters for Counters.Counter;
    // Declare a set state variable
    EnumerableMap.UintToAddressMap private _campaigns;

    Counters.Counter private _counter;

    struct OwnerCampaign{
        address addr;
        uint256 amount;
    }

    mapping(address => uint256[]) private ownersCampaign; //owneraddress -> campaignIndex
    

    mapping(address => address payable ) public _tokenCampaigns; //tokenAddress=>Campaign

    event CampaignCreated(address indexed creator,uint256 indexed index, address createdCampaignAddress);
    
    uint public campaignCreationPrice = 0.0001 ether; 

    constructor()  {      

    }

    function setCampaignCreationPrice(uint256 newPrice) public onlyOwner{
        campaignCreationPrice=newPrice;
    }

    
    function createNewCampaign(address _tokenAddress,uint _softCap,uint _hardCap, uint256 _saleStartTime, uint256 _saleEndTime,   bool _useWhiteList, Campaign.RefundType _refundType, address _dexRouterAddress,uint _liquidityPercent, uint _listRate, uint _dexListRate,uint _maxAllocationPerUserTierTwo) public payable  {

        require(msg.value >= campaignCreationPrice, 'CampaignFactory: Requires CampaignCreation Price' );
        
        if(_tokenCampaigns[_tokenAddress] != address(0)){
            Campaign ct = Campaign(_tokenCampaigns[_tokenAddress]);
            if( !(ct.status() == Campaign.CampaignStatus.CANCELLED || ct.status()== Campaign.CampaignStatus.FAILED) ){
                revert('CampaignFactory: There is an Existing Campaign');
            }
        }
        
        {
            Campaign cmpgn = new Campaign(_tokenAddress, _softCap,_hardCap, _saleStartTime, _saleEndTime,   _useWhiteList, _refundType, _dexRouterAddress,_liquidityPercent, _listRate, _dexListRate,_maxAllocationPerUserTierTwo
            );
            _counter.increment();            
            _campaigns.set(_counter.current(), address( cmpgn));

            //avoid stack too deep
            {
                ownersCampaign[msg.sender].push( _counter.current());        
                _tokenCampaigns[_tokenAddress]= payable(address( cmpgn));
                emit CampaignCreated(msg.sender, _counter.current(),address( cmpgn));
            }
        }
    }

    
    function allCampaigns() public view returns (uint256) {
        return _campaigns.length();
    }

    function allOwnersCampaigns() public view returns (uint256[] memory) {
        return ownersCampaign[msg.sender];
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

    function tryGetCampaignByTokenAddress(address _tokenAddress) public view returns ( address) {
        return _tokenCampaigns[_tokenAddress];
    }

    //abi.encodePacked(x)
    function concatenate(string memory s1, string memory s2) public pure returns (string memory) {
        return string(abi.encodePacked(s1, s2));
    }

    function concatenate(string memory s1, address s2) public pure returns (string memory) {
        return string(abi.encodePacked(s1, s2));
    }

}