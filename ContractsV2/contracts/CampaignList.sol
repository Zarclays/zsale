// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Campaign.sol";
import './Lockers/DexLockerFactory.sol';
import "hardhat/console.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";



contract CampaignList is Context,Ownable  {
    using SafeERC20 for IERC20;
  // Add the library methods
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using Counters for Counters.Counter;
    // Declare a set state variable
    EnumerableMap.UintToAddressMap private _campaigns;

    Counters.Counter private _counter;

    DexLockerFactory private _dexLockerFactory;

    mapping(address => uint256[]) private ownersCampaign; //owneraddress -> campaignIndex
    

    mapping(address => address payable ) public _tokenCampaigns; //tokenAddress=>Campaign

    event CampaignCreated(address indexed creator,uint256 indexed index, address createdCampaignAddress);
    
    uint public campaignCreationPrice = 0.00001 ether; 
    
    address  _campaignImplementationAddress;

    constructor(DexLockerFactory dexLockerFactory, address campaignImplementationAddress)  {      
       _dexLockerFactory=dexLockerFactory;
       _campaignImplementationAddress = campaignImplementationAddress;
    }

    function setCampaignCreationPrice(uint256 newPrice) public onlyOwner{
        campaignCreationPrice=newPrice;
    }

    function createNewCampaign(address _tokenAddress,
    uint256[10] memory capAndDate,  
        Campaign.RefundType _refundType, address _dexRouterAddress,uint[4] memory liquidityAllocationAndRates,
        string[6] memory founderInfo,
        bool[2] memory _useTokenOrRaisedFundsVesting,
        VestSchedule[8] memory teamTokenVestingDetails, 
        uint256[3] memory raisedFundVestingDetails //percentOfRaisedFundsToLock,duration, cliff
    ) public payable  {

        require(msg.value >= campaignCreationPrice, 'CampaignFactory: Requires CampaignCreation Price' );
        
        if(_tokenCampaigns[_tokenAddress] != address(0)){
            Campaign ct = Campaign(_tokenCampaigns[_tokenAddress]);
            if( !(ct.status() == Campaign.CampaignStatus.CANCELLED || ct.status()== Campaign.CampaignStatus.FAILED) ){
                revert('CampaignFactory: There is an Existing Campaign');
            }
        }
        
        {     
            _counter.increment(); 
            capAndDate[9] = _counter.current();

            address payable newCampaignCloneAddress = payable(Clones.clone(_campaignImplementationAddress) );
            Campaign(newCampaignCloneAddress).initialize([msg.sender, address(this) , _tokenAddress], capAndDate,    _refundType, _dexRouterAddress,liquidityAllocationAndRates, teamTokenVestingDetails, raisedFundVestingDetails,founderInfo, _dexLockerFactory, _useTokenOrRaisedFundsVesting);

             _campaigns.set(_counter.current(), newCampaignCloneAddress);
            ownersCampaign[msg.sender].push( _counter.current());        
            _tokenCampaigns[_tokenAddress]= payable(newCampaignCloneAddress);
            emit CampaignCreated(msg.sender, _counter.current(),newCampaignCloneAddress);

            // Campaign cmpgn = new Campaign( [msg.sender, address(this) , _tokenAddress], capAndDate,    _refundType, _dexRouterAddress,liquidityAllocationAndRates, teamTokenVestingDetails, raisedFundVestingDetails,founderInfo, _dexLockerFactory, _useTokenOrRaisedFundsVesting
            // );
                       
            // _campaigns.set(_counter.current(), address( cmpgn));
            // ownersCampaign[msg.sender].push( _counter.current());        
            // _tokenCampaigns[_tokenAddress]= payable(address( cmpgn));
            // emit CampaignCreated(msg.sender, _counter.current(),address( cmpgn));
        }
    }


    function hasExistingCampaign(address _tokenAddress) external view returns (bool){
        return _tokenCampaigns[_tokenAddress] != address(0);
    }
    function allOwnersCampaigns(uint256 limit, uint256 offset) public view returns (uint256[] memory) {
        return ownersCampaign[msg.sender];
    }

    
    function campaignSize() public view returns (uint256) {
        return _campaigns.length();
    }

    function transferTokens(address payable campaignAddress) public 
    {
        Campaign ct = Campaign(campaignAddress);
        require(ct.owner()== _msgSender(), 'CAMPAIGNList: Transfer token - Not Owner');

        uint256 amount = ct.totalTokensExpectedToBeLocked();
        IERC20 _token = IERC20(ct.tokenAddress());
        _token.safeTransferFrom(_msgSender(), address(this), amount);

        _token.safeTransfer( campaignAddress, amount);
        ct.startReceivingBids();
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

    // //abi.encodePacked(x)
    // function concatenate(string memory s1, string memory s2) public pure returns (string memory) {
    //     return string(abi.encodePacked(s1, s2));
    // }

    // function concatenate(string memory s1, address s2) public pure returns (string memory) {
    //     return string(abi.encodePacked(s1, s2));
    // }

}