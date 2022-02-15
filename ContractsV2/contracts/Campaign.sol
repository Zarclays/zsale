// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './Lockers/DexLockerFactory.sol';
import './Lockers/DexLocker.sol';
import "./Lockers/VestSchedule.sol";

import "hardhat/console.sol";



// interface iCampaignList {
//   function hasExistingCampaign(address _tokenAddress) external view returns (bool);
//   function createNewCampaign(address _tokenAddress, address _campaignAddress) external payable ;
// }

contract Campaign is Context,Ownable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  event AdminOwnershipTransferred(address indexed previousAdmin, address indexed newAdmin);
  event ValueReceived(address user, uint amount);
  event Withdrawn(address user, uint amount);
  event Refunded(address user, uint amount);
  event SoldOut();

  struct CampaignSaleInfo{
      //token attributes
      address   tokenAddress; 
      uint256  softCap; // Soft cap in coin
      uint256  hardCap; // Max cap in coin
      uint256  saleStartTime; // start sale time
      uint256  saleEndTime; // end sale time
      uint   liquidityPercent; // multiplied by 100 e.g 45% is 4500
      uint   listRate; 
      uint   dexListRate;
  }
  struct CampaignOtherInfo{
      bool   useWhiteList;//Use in only Tier 2
      bool   hasKYC;
      bool   isAudited; 
      string auditUrl;
      RefundType  refundType;
      string logoUrl;
      string desc;
      string website;
      string twitter;
      string telegram;
      
  }
  enum CampaignStatus{ 
    CREATED,
    DETAILS_FILLED,
    CANCELLED, // Cancelled before the start date
    
    FAILED, // WIll need refund
    LIQUIDITY_SETUP

  }
  
  CampaignStatus public  status = CampaignStatus.CREATED;

  address private _admin= 0xB7e16f5fa9941B84baCd1601F277B00911Aed339; //zsales admin - can setkyc and audited
  
  
  CampaignSaleInfo public  saleInfo;
  CampaignOtherInfo public otherInfo;
  
  address public immutable  dexRouterAddress;
  uint256 public totalCoinReceived; // total  received
  uint256 public totalCoinInTierOne; // total coin for tier one
  uint256 public totalCoinInTierTwo; // total coin for tier Tier
  
  uint public totalParticipants; // total participants in ido
  

  address public zsalesTokenAddress;
  uint zsaleFee = 200;  //2%   - percent of native currency to take
  uint zsaleTokenFee = 200;  //2% - percent fee of token to take


  address zsalesWalletAddress = 0xB7e16f5fa9941B84baCd1601F277B00911Aed339 ; // receives commissions

  uint private tier1TimeLineInHours = 2; // e.g 2 hours before startime
  
  // max cap per tier
  uint public tierOnehardCap;
  uint public tierTwohardCap;
    
  //total users per tier
  uint public totalUserInTierOne;
  uint public totalUserInTierTwo;
  
  

    //Tier 1 - holders of our coin
    //Tier 2 - Whitelisted or public
    

  //max allocations per user in a tier
  uint public maxAllocationPerUserTierOne;
  uint public maxAllocationPerUserTierTwo; 
  
 
  // address array for tier one whitelist
  address[] private whitelistTierOne;  // every tokenholder is automatically whitelisted
  
  // address array for tier two whitelist
  address[] private whitelistTierTwo; 
  


  enum RefundType{ BURN, REFUND }
  
  uint256 public liquidityReleaseTime; // time to relesase Lp tokens to owner

  //mapping the user purchase per tier
  mapping(address => uint) public buyInOneTier;
  mapping(address => uint) public buyInTwoTier;
  mapping(address => uint) public buyInAllTiers;
  DexLockerFactory private _dexLockerFactory;
  address payable private _dexLockerAddress;
  address public _campaignFactory= 0x92Fe2933C795FF95A758362f9535A4D0a516053d ;
  
  constructor(
    address campaignOwner,
    address campaignFactory,
    address  _tokenAddress,
     
    uint256[8] memory capAndDate,  // uint256 _softCap,uint256 _hardCap,uint256 _saleStartTime,uint256 _saleEndTime, uint256 _tierOneHardCap, uint256 _tierTwoHardCap, uint256 _maxAllocationPerUserTierOne, uint256 _maxAllocationPerUserTierTwo 
    
    RefundType _refundType, 
    address _dexRouterAddress,
    uint _liquidityPercent, 
    uint _listRate, 
    uint _dexListRate,
    uint _maxAllocationPerUserTierTwo,
    DexLockerFactory dexLockerFactory
    
  ) payable  {
      _campaignFactory= campaignFactory;
      _dexLockerFactory=dexLockerFactory;
      require(capAndDate[2] > block.timestamp, "CAMPAIGN: Sale Start time needs to be above current time");
      // require(releaseTime > block.timestamp, "CAMPAIGN: release time above current time");
      require(capAndDate[3] > capAndDate[2], "CAMPAIGN: Sale End time above start time");
      require(_liquidityPercent >= 5100, "CAMPAIGN: Liquidity allowed is > 51 %");
        
        
      // //block scopin to avoid stack too deep 
      {
        // saleInfo= CampaignSaleInfo(_tokenAddress,_softCap,_hardCap, _saleStartTime, _saleEndTime,_liquidityPercent,_listRate, _dexListRate );

        // saleInfo= CampaignSaleInfo();
        saleInfo.tokenAddress=_tokenAddress;
        saleInfo.softCap=capAndDate[0];
        saleInfo.hardCap=capAndDate[1];
        saleInfo.saleStartTime=capAndDate[2];
        saleInfo.saleEndTime=capAndDate[3];
        saleInfo.liquidityPercent=_liquidityPercent;
        saleInfo.listRate=_listRate;
        saleInfo.dexListRate=_dexListRate;
      }        

      {    
        dexRouterAddress=_dexRouterAddress; 
         
      }
        
      otherInfo= CampaignOtherInfo(false, false,false,'', _refundType,'','','','','');
      
      
      updateTierDetails (capAndDate[4], capAndDate[5], capAndDate[6],capAndDate[7]);

      transferOwnership(campaignOwner);
  }

  // function to update other details not initialized in constructor - this is bcos solidity limits how many variables u can pass in at once
  function updateCampaignDetails(uint liquidityReleaseTimeDays, //Time to add to startTime in days
    bool _useWhiteList, 
    string memory logoUrl,
    string memory desc,
    string memory website,
    string memory twitter,
    string memory telegram,
    VestSchedule[8] memory teamTokenVestingDetails, 
    VestSchedule[8] memory raisedFundVestingDetails
  ) external onlyOwner {
    liquidityReleaseTime  = saleInfo.saleEndTime + (liquidityReleaseTimeDays * 1 days);
    otherInfo.logoUrl= logoUrl;
    otherInfo.desc= desc;
    otherInfo.website= website;
    otherInfo.twitter= twitter;
    otherInfo.telegram= telegram;
    otherInfo.useWhiteList=_useWhiteList;

    

    //Set dexLock
    DexLocker dexLocker =_dexLockerFactory.createDexLocker(dexRouterAddress,saleInfo.tokenAddress,address(this), msg.sender);
    //DexLocker dexLocker = new DexLocker(dexRouterAddress,saleInfo.tokenAddress, msg.sender);
    dexLocker.setupLock( liquidityReleaseTime,  saleInfo.dexListRate, teamTokenVestingDetails, raisedFundVestingDetails);
    _dexLockerAddress= payable(dexLocker);

    status = CampaignStatus.DETAILS_FILLED;

  }
    
  // function to update the tiers users value manually
  function updateTierDetails(uint256 _tierOneHardCap, uint256 _tierTwoHardCap, uint256 _maxAllocationPerUserTierOne, uint256 _maxAllocationPerUserTierTwo) public onlyOwner {
    require(block.timestamp < saleInfo.saleStartTime, 'Can only updateTierDetails before Sale StartTime');
    require(_tierOneHardCap > (saleInfo.hardCap * 3000 / 10000), "CAMPAIGN: Tier Caps must be greater than 30 %" );
    require(_tierOneHardCap + _tierTwoHardCap == saleInfo.hardCap, "CAMPAIGN: Tier 1 & 2 Caps must be equal to hard cap" );
    
    console.log("maxAllocationPerUserTierOne:", maxAllocationPerUserTierOne);
    require(_maxAllocationPerUserTierOne > 0, "CAMPAIGN: Tier 1 Max Allocation must be greater than 0" );
    require(_maxAllocationPerUserTierTwo > 0, "CAMPAIGN: Tier 2 Max Allocation must be greater than 0" );
    
    
    tierOnehardCap =_tierOneHardCap;
    tierTwohardCap = _tierTwoHardCap;
    
    
    maxAllocationPerUserTierOne = _maxAllocationPerUserTierOne;
    maxAllocationPerUserTierTwo = _maxAllocationPerUserTierTwo; 
    
  }


  function cancelCampaign() public onlyOwner{
    require(block.timestamp < saleInfo.saleStartTime, 'Can only cancel before Sale StartTime');
    status=CampaignStatus.CANCELLED;
  }

  function end() public view returns (uint256) {
    return saleInfo.saleEndTime;
  }

  // function setCampaignFactory(address _newCampaignFactory) public onlyAdmin {
  //   _campaignFactory=_newCampaignFactory;
  // }




  // //add the address in Whitelist tier One to invest
  // function addWhitelistOne(address _address) public onlyOwner {

  //   //Every token holder is automatically whitelisted, so no needfor this

  //   require(_address != address(0), "Invalid address");
  //   whitelistTierOne.push(_address);
  // }

  //add the address in Whitelist tier two to invest
  function addWhitelistTwo(address _address) public onlyOwner {
    require(_address != address(0), "Invalid address");
    whitelistTierTwo.push(_address);
  }

  // check the address is a Token Holder
  function isAllowedInTier1(address _address) public view returns(bool) {
    IERC20 token = IERC20(zsalesTokenAddress);
    return token.balanceOf(_address) > 0;
  }

  // check the address in whitelist tier one
  function isInTier1WhiteList(address _address) public view returns(bool) {
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
  function isInTier2WhiteList(address _address) public view returns(bool) {
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

  /**
    * @dev Throws if called by any account other than the owner.
  */
  modifier onlyAdmin() {
      require(_admin == _msgSender(), "ADMIN: caller is not the admin");
      _;
  }

  function changeAdmin(address newAdmin) public onlyAdmin  {
      require(_msgSender() == _admin, 'ADMIN: Only Admin can change');
      address oldOwner = _admin;
      _admin=newAdmin;

      emit AdminOwnershipTransferred(oldOwner, newAdmin);
  }

  
  

  
  function setKYC(bool kyc) public onlyAdmin  {
      require(block.timestamp< saleInfo.saleStartTime, 'Can only change KYC before Sale StartTime');
      otherInfo.hasKYC= kyc;
  }
  function hasKYC() public view returns (bool) {
    return otherInfo.hasKYC;
  }

  
  function setAudited(bool audit) public onlyAdmin  {
    require(block.timestamp< saleInfo.saleStartTime, 'Can only change KYC before Sale StartTime');
      otherInfo.isAudited= audit;
  }
  function isAudited() public view returns (bool, string memory ) {
    return (otherInfo.isAudited, otherInfo.auditUrl);
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

  function setTier1TimeLineInHours (uint newValue) public onlyAdmin {
    tier1TimeLineInHours=newValue;
  }

  // send coin to the contract address
  receive() external payable {
    uint256 bid = msg.value;
    require(status!=CampaignStatus.CANCELLED, 'Campaign: Sale Cancelled');
    require(totalCoinReceived < saleInfo.hardCap, 'Campaign: Sale Sold out');
    require(block.timestamp >= saleInfo.saleStartTime, "Campaign:The sale is not started yet "); // solhint-disable
    require(block.timestamp <= saleInfo.saleEndTime, "Campaign:The sale is closed"); // solhint-disable
    require(totalCoinReceived + bid <= saleInfo.hardCap, "Campaign: purchase would exceed max cap");
    require(status == CampaignStatus.FAILED , "Campaign: Failed, Refunded is activated");
    
    
    require(bid > 0, "Campaign: Coin value sent needs to be above zero");
    
          

    if ( block.timestamp >= saleInfo.saleStartTime - (tier1TimeLineInHours *1 hours ) ) {  // istokenholder and isstill in tokenholder sales part  //  isInTier1WhiteList(msg.sender)
        require(isAllowedInTier1(msg.sender) , "Campaign: Only Tokenholders are allowed to buy in Tier 1 window");
        require(totalCoinInTierOne + bid <= tierOnehardCap, "Campaign: purchase would exceed Tier one max cap");
        require(buyInOneTier[msg.sender] + bid <= maxAllocationPerUserTierOne ,"Campaign:You are investing more than your tier-1 limit!");
        buyInOneTier[msg.sender] += bid;
        buyInAllTiers[msg.sender] += bid;
        totalCoinReceived += bid;
        totalCoinInTierOne += bid;
        totalParticipants++;

        emit ValueReceived(msg.sender, bid);

    
    } else {
        if(otherInfo.useWhiteList){
          require(isInTier2WhiteList(msg.sender), "Campaign: You are not in whitelist");
        }
        require(totalCoinInTierTwo + bid <= tierTwohardCap, "Campaign: purchase would exceed Tier two max cap");
        require(buyInTwoTier[msg.sender] + bid <= maxAllocationPerUserTierTwo ,"Campaign:You are investing more than your tier-2 limit!");
        buyInTwoTier[msg.sender] += bid;
        buyInAllTiers[msg.sender] += bid;
        totalCoinReceived += bid;
        totalCoinInTierTwo += bid;
        totalParticipants++;
    
        emit ValueReceived(msg.sender, bid);

        
    }

    
  }

  // function finalizeAndwithdraw () public onlyOwner  {
  //   require(status!=CampaignStatus.CANCELLED, 'Campaign: Sale Cancelled');
  //   //todo
  // }

  /**
  * @dev Withdraw tokens or coin by user after end time
  * If this project does not reach softcap, return their funds otherwise get tokens 
  */
  function withdrawFunds () public   {
    
    require(msg.sender!= owner(), 'CAMPAIGN: Owners cannot withdraw' );
    // require(status.isCancelled, 'Campaign: Can only withdraw if Campaign Cancelled');

    // if campaign is sold out no need to wait for endtime finalize and setup liquidity
    require(block.timestamp >= saleInfo.saleEndTime || totalCoinReceived>= saleInfo.hardCap  , "CAMPAIGN: ongoing sales");

    require(buyInAllTiers[msg.sender] > 0, "CAMPAIGN: No COIN to claim");
    
    
    uint256 amount =  buyInAllTiers[msg.sender];
    buyInAllTiers[msg.sender] = 0;
    uint256 amountTokens =  amount * saleInfo.listRate;
    
    if(status== CampaignStatus.FAILED){
        // return back funds
        payable(msg.sender).transfer(amount);
        emit Refunded(msg.sender, amount);
        
    }else{
      IERC20 _token = IERC20(saleInfo.tokenAddress);
      // Transfer Tokens to User
      _token.safeTransfer(msg.sender, amountTokens);
      
      emit Withdrawn(msg.sender, amountTokens);
    }    
  }

  /**
    * Setup liquidity and transfer all amounts according to defined percents, if softcap not reached set Refunded flag
    */
  function finalizeAndSetupLiquidity() public {
      require(totalCoinReceived>= saleInfo.hardCap || block.timestamp > end() , "Campaign: not sold out or time not elapsed yet" );
      require(status != CampaignStatus.FAILED, "CAMPAIGN: campaign will be refunded");
      require(status != CampaignStatus.CANCELLED, "CAMPAIGN: campaign was cancelled");
      //
      if(totalCoinReceived < saleInfo.softCap){
          status== CampaignStatus.FAILED ;
          return;
      }

      IERC20 _token = IERC20(saleInfo.tokenAddress);

      
      uint256 currentCoinBalance = address(this).balance;
      require(currentCoinBalance > 0, "CAMPAIGN: Coin balance needs to be above zero" );
      uint256 liquidityAmount = currentCoinBalance * saleInfo.liquidityPercent / 10000;
      uint256 tokensAmount = _token.balanceOf(address(this));
      require(tokensAmount >= liquidityAmount * saleInfo.dexListRate  , "CAMPAIGN: Not sufficient tokens amount");
      // uint256 teamAmount = currentCoinBalance.mul(_teamPercent).div(_totalPercent);

      uint256 zsaleFeeAmount = currentCoinBalance * zsaleFee / 10000;
      uint256 zsaleTokenFeeAmount = currentCoinBalance * zsaleTokenFee/ 10000;
      
      //Fees
      payable(zsalesWalletAddress).transfer(zsaleFeeAmount);
     _token.safeTransfer(zsalesWalletAddress, zsaleTokenFeeAmount);
      // payable(_teamWallet).transfer(teamAmount);

      //liquidity pair
      payable(_dexLockerAddress).transfer(liquidityAmount);
      _token.safeTransfer(_dexLockerAddress, liquidityAmount * saleInfo.dexListRate );
          
      
      DexLocker(_dexLockerAddress).addLiquidity();
      
      status== CampaignStatus.LIQUIDITY_SETUP;
  }

  
  function getCampaignInfo() public view returns(address _tokenAddress, uint256 softcap, uint256 hardcap,uint256 saleStartTime, uint256 saleEndTime,uint256 listRate, uint256 dexListRate ,uint256 totalCoins, uint256 totalParticipant, bool useWhiteList, bool hasKyc, bool isAuditd ){
      return (saleInfo.tokenAddress, saleInfo.softCap, saleInfo.hardCap,saleInfo.saleStartTime, saleInfo.saleEndTime, saleInfo.listRate, saleInfo.dexListRate,totalCoinReceived,totalParticipants, otherInfo.useWhiteList,otherInfo.hasKYC, otherInfo.isAudited );
  }

  function getCampaignStatus() public view returns(CampaignStatus ){
      return (status );
  }

  function getCampaignPeriod() public view returns(uint256 saleStartTime, uint256 saleEndTime ){
      return (saleInfo.saleStartTime, saleInfo.saleEndTime );
  }

  function getCampaignSalePriceInfo() public view returns(uint256 , uint256,uint256 , uint256,uint256 , uint256,uint256 ){
      return (saleInfo.listRate, saleInfo.dexListRate, saleInfo.softCap, saleInfo.hardCap, tierOnehardCap,tierTwohardCap, maxAllocationPerUserTierTwo  );
  }

  /**
    * 
    */
  function isSoldOut() public view returns (bool) {
      return totalCoinReceived>= saleInfo.hardCap;
  }

    /**
    * 
    */
  function hasFailed() public view returns (bool) {
      return status == CampaignStatus.FAILED;
  }

  
  function dexLockerAddress() public view onlyAdmin returns (address) {
      return _dexLockerAddress;
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