// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";





contract Campaign is Context,Ownable, ReentrancyGuard {

    struct CampaignSaleInfo{
        //token attributes
        address   tokenAddress; 
        uint256  softCap; // Soft cap in coin
        uint256  hardCap; // Max cap in coin
        uint256  saleStartTime; // start sale time
        uint256  saleEndTime; // end sale time
        uint   liquidityPercent;
        uint   listRate; 
        uint   dexListRate;
    }
    struct CampaignOtherInfo{
        bool   useWhiteList;
        bool   hasKYC;
        bool   isAudited;  
        RefundType  refundType;
        string logoUrl;
        string desc;
        string website;
        string twitter;
        string telegram;
        

        
        
    }


  CampaignSaleInfo public  saleInfo;
  CampaignOtherInfo public otherInfo;
  address public immutable  dexRouterAddress;
  uint256 public totalCoinReceived; // total  received
  uint256 public totalCoinInTierOne; // total coin for tier one
  uint256 public totalCoinInTierTwo; // total coin for tier Tier
  uint256 public totalCoinInTierThree; // total coin for tier Three
  uint public totalParticipants; // total participants in ido
  
  
  // max cap per tier
  uint public tierOnehardCap;
  uint public tierTwohardCap;
  uint public tierThreehardCap;
  
  //total users per tier
  uint public totalUserInTierOne;
  uint public totalUserInTierTwo;
  uint public totalUserInTierThree;
  

    //Tier 1 - holders of our coin
    //Tie 2 - Whitelisted
    //Tier 3 - Public 

  //max allocations per user in a tier
  uint public maxAllocationPerUserTierOne;
  uint public maxAllocationPerUserTierTwo; 
  uint public maxAllocationPerUserTierThree;
 
  // address array for tier one whitelist
  address[] private whitelistTierOne; 
  
  // address array for tier two whitelist
  address[] private whitelistTierTwo; 
  
  // address array for tier three whitelist
  address[] private whitelistTierThree; 

  enum RefundType{ BURN, REFUND }
  
  bool public isCancelled=false;

  //mapping the user purchase per tier
  mapping(address => uint) public buyInOneTier;
  mapping(address => uint) public buyInTwoTier;
  mapping(address => uint) public buyInThreeTier;

  // CONSTRUCTOR  
  constructor(address  _tokenAddress,uint256 _softCap,uint256 _hardCap, uint256 _saleStartTime, uint256 _saleEndTime,   bool _useWhiteList, RefundType _refundType, address _dexRouterAddress,uint _liquidityPercent, uint _listRate, uint _dexListRate
  )  {
      // //block scopin to avoid stack too deep 
      {
          saleInfo= CampaignSaleInfo(_tokenAddress,_softCap,_hardCap, _saleStartTime, _saleEndTime,_liquidityPercent,_listRate, _dexListRate );
      }
        

        {    
                dexRouterAddress=_dexRouterAddress;    
        }

        otherInfo= CampaignOtherInfo(_useWhiteList, false,false, _refundType);

     
    
        
        // {
        //     tierOnehardCap =_tierOneValue;
        //     tierTwohardCap = _tierTwoValue;
        //     tierThreehardCap =_tierThreeValue;
        //     totalUserInTierOne =_tierOneUsersValue;
        //     totalUserInTierTwo = _tierTwoUsersValue;
        //     totalUserInTierThree =_tierThreeUsersValue;
        //     maxAllocationPerUserTierOne = tierOnehardCap / totalUserInTierOne;
        //     maxAllocationPerUserTierTwo = tierTwohardCap / totalUserInTierTwo; 
        //     maxAllocationPerUserTierThree = tierThreehardCap / totalUserInTierThree;
        // }
        

  }

  // function to update the tiers value manually
    
  // function to update the tiers users value manually
  function updateTierDetails(uint256 _tierOneHardCap, uint256 _tierTwoHardCap, uint256 _tierThreeHardCap, uint256 _maxAllocationPerUserTierOne, uint256 _maxAllocationPerUserTierTwo, uint256 _maxAllocationPerUserTierThree) external onlyOwner {

    tierOnehardCap =_tierOneHardCap;
    tierTwohardCap = _tierTwoHardCap;
    tierThreehardCap =_tierThreeHardCap;
    
    maxAllocationPerUserTierOne = _maxAllocationPerUserTierOne;
    maxAllocationPerUserTierTwo = _maxAllocationPerUserTierTwo; 
    maxAllocationPerUserTierThree = _maxAllocationPerUserTierThree;
  }


  function cancelCampaign() public onlyOwner{
    require(block.timestamp< saleInfo.saleStartTime, 'Can only cancel before Sale StartTime');
    isCancelled=true;
  }



  //add the address in Whitelist tier One to invest
  function addWhitelistOne(address _address) external onlyOwner {
    require(_address != address(0), "Invalid address");
    whitelistTierOne.push(_address);
  }

  //add the address in Whitelist tier two to invest
  function addWhitelistTwo(address _address) external onlyOwner {
    require(_address != address(0), "Invalid address");
    whitelistTierTwo.push(_address);
  }

  //add the address in Whitelist tier three to invest
  function addWhitelistThree(address _address) external onlyOwner {
    require(_address != address(0), "Invalid address");
    whitelistTierThree.push(_address);
  }

  // check the address in whitelist tier one
  function getWhitelistOne(address _address) public view returns(bool) {
    uint i;
    uint length = whitelistTierOne.length;
    for (i = 0; i < length; i++) {
      address _addressArr = whitelistTierOne[i];
      if (_addressArr == _address) {
        return true;
      }
    }
    return false;
  }

  // check the address in whitelist tier two
  function getWhitelistTwo(address _address) public view returns(bool) {
    uint i;
    uint length = whitelistTierTwo.length;
    for (i = 0; i < length; i++) {
      address _addressArr = whitelistTierTwo[i];
      if (_addressArr == _address) {
        return true;
      }
    }
    return false;
  }

  // check the address in whitelist tier three
  function getWhitelistThree(address _address) public view returns(bool) {
    uint i;
    uint length = whitelistTierThree.length; 
    for (i = 0; i < length; i++) {
      address _addressArr = whitelistTierThree[i];
      if (_addressArr == _address) {
        return true;
      }
    }
    return false;
  }

    function setKYC(bool kyc) public onlyOwner  {
        require(block.timestamp< saleInfo.saleStartTime, 'Can only change KYC before Sale StartTime');
        otherInfo.hasKYC= kyc;
    }
    function hasKYC() public view returns (bool) {
            return otherInfo.hasKYC;
    }

    function isAudited() public view returns (bool) {
            return otherInfo.isAudited;
    }
    function setAudited(bool audit) public onlyOwner  {
        require(block.timestamp< saleInfo.saleStartTime, 'Can only change KYC before Sale StartTime');
        otherInfo.isAudited= audit;
    }


    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
 
    // send coin to the contract address
    receive() external payable {
        uint256 bid = msg.value;
        require(!isCancelled, 'Campaign:: Sale Cancelled');
        require(block.timestamp >= saleInfo.saleStartTime, "Campaign::The sale is not started yet "); // solhint-disable
        require(block.timestamp <= saleInfo.saleEndTime, "Campaign::The sale is closed"); // solhint-disable
        require(totalCoinReceived + bid <= saleInfo.hardCap, "buyTokens: purchase would exceed max cap");
        
        if (getWhitelistOne(msg.sender)) { 
            require(totalCoinInTierOne + bid <= tierOnehardCap, "buyTokens: purchase would exceed Tier one max cap");
            require(buyInOneTier[msg.sender] + bid <= maxAllocationPerUserTierOne ,"buyTokens:You are investing more than your tier-1 limit!");
            buyInOneTier[msg.sender] += bid;
            totalCoinReceived += bid;
            totalCoinInTierOne += bid;
            totalParticipants++;
        
        } else if (getWhitelistTwo(msg.sender)) {
            require(totalCoinInTierTwo + bid <= tierTwohardCap, "buyTokens: purchase would exceed Tier two max cap");
            require(buyInTwoTier[msg.sender] + bid <= maxAllocationPerUserTierTwo ,"buyTokens:You are investing more than your tier-2 limit!");
            buyInTwoTier[msg.sender] += bid;
            totalCoinReceived += bid;
            totalCoinInTierTwo += bid;
            totalParticipants++;
        
        } else if (getWhitelistThree(msg.sender)) { 
            require(totalCoinInTierThree + bid <= tierThreehardCap, "buyTokens: purchase would exceed Tier three max cap");
            require(buyInThreeTier[msg.sender] + bid <= maxAllocationPerUserTierThree ,"buyTokens:You are investing more than your tier-3 limit!");
            buyInThreeTier[msg.sender] += bid;
            totalCoinReceived += bid;
            totalCoinInTierThree += bid;        
            totalParticipants++;
        } else {
            revert();
        }
    }


    function finalizeAndwithdraw () public onlyOwner  {
      require(!isCancelled, 'Campaign:: Sale Cancelled');
    }

    function withdrawRefund () public   {
        require(isCancelled, 'Campaign:: Can only withdraw if Campaign Cancelled');
        require(msg.sender!= owner() );

    }


    function getCampaignInfo() public view returns(address _tokenAddress, uint256 softcap, uint256 hardcap,uint256 saleStartTim, uint256 saleEndTime,uint256 listRate, uint256 dexListRate ,uint256 totalCoins, uint256 totalParticipant, bool useWhiteList, bool hasKYC, bool isAuduited ){
        return (saleInfo.tokenAddress, saleInfo.softCap, saleInfo.hardCap,saleInfo.saleStartTime, saleInfo.saleEndTime, saleInfo.listRate, saleInfo.dexListRate,totalCoinReceived,totalParticipants, otherInfo.useWhiteList,otherInfo.hasKYC, otherInfo.isAudited );
    }

    
  
    // //To get refund when the requirement not ment
    // function getRefund() public {
    //     require(block.number > saleEndTime, 'salenedtime ......');
    //     require(block.number >= saleStartTime);
    //     require(contributions[msg.sender] > 0);

    //     msg.sender.transfer(contributions[msg.sender]);
    //     contributions[msg.sender] = 0;
    // }

}