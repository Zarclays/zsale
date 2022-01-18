// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import './DexLocker.sol';





contract Campaign is Context,Ownable, ReentrancyGuard {

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

  struct CampaignStatus{
    bool isCancelled;
    bool isSoldOut;
    bool isLiquiditySetup;
    bool isRefunded;
  }

  address private _admin= 0xB7e16f5fa9941B84baCd1601F277B00911Aed339; //zsales admin - can setkyc and audited
  
  
  CampaignSaleInfo public  saleInfo;
  CampaignOtherInfo public otherInfo;
  CampaignStatus status;
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
  
  DexLocker private _dexLocker;
  
  constructor(
    address  _tokenAddress,
    uint256 _softCap,
    uint256 _hardCap, 
    uint256 _saleStartTime, 
    uint256 _saleEndTime,   
    bool _useWhiteList, 
    RefundType _refundType, 
    address _dexRouterAddress,
    uint _liquidityPercent, 
    uint _listRate, 
    uint _dexListRate,
    uint _maxAllocationPerUserTierTwo
    
  ) {
      require(_saleStartTime > block.timestamp, "CAMPAIGN: Sale Start time needs to be above current time");
      // require(releaseTime > block.timestamp, "CAMPAIGN: release time above current time");
      require(_saleEndTime > _saleStartTime, "CAMPAIGN: Sale End time above start time");
      require(_liquidityPercent >= 5100, "CAMPAIGN: Liquidity allowed is > 51 %");
        
        
      // //block scopin to avoid stack too deep 
      {
        saleInfo= CampaignSaleInfo(_tokenAddress,_softCap,_hardCap, _saleStartTime, _saleEndTime,_liquidityPercent,_listRate, _dexListRate );
      }        

      {    
        dexRouterAddress=_dexRouterAddress; 
         
      }
        
      otherInfo= CampaignOtherInfo(_useWhiteList, false,false,'', _refundType,'','','','','');

      tierOnehardCap=_hardCap / 2; //50% by default
      maxAllocationPerUserTierOne = tierOnehardCap/50 ;  //50 people by default

      tierTwohardCap=_hardCap / 2; //50% by default
      maxAllocationPerUserTierTwo = _maxAllocationPerUserTierTwo ;  
      addWhitelistOne(msg.sender);

      //Todo : Adjust releasetime to time set by user
      //Set dexLock
      _dexLocker = new DexLocker(_dexRouterAddress, saleInfo.saleEndTime + 100,  msg.sender, saleInfo.dexListRate);
      
  }

  // function to update other details not initialized in constructor - this is bcos solidity limits how many variables u can pass in at once
  function updateCampaignDetails(uint liquidityReleaseTimeDays, //Time to add to startTime in days
    string memory logoUrl,
    string memory desc,
    string memory website,
    string memory twitter,
    string memory telegram
  ) external onlyOwner {
    liquidityReleaseTime  = saleInfo.saleEndTime + (liquidityReleaseTimeDays * 1 days);
    otherInfo.logoUrl= logoUrl;
    otherInfo.desc= desc;
    otherInfo.website= website;
    otherInfo.twitter= twitter;
    otherInfo.telegram= telegram;


  }
    
  // function to update the tiers users value manually
  function updateTierDetails(uint256 _tierOneHardCap, uint256 _tierTwoHardCap, uint256 _maxAllocationPerUserTierOne, uint256 _maxAllocationPerUserTierTwo) external onlyOwner {
    require(block.timestamp < saleInfo.saleStartTime, 'Can only updateTierDetails before Sale StartTime');
    require(_tierOneHardCap > (saleInfo.hardCap * 3000 / 10000), "CAMPAIGN: Tier Caps must be greater than 30 %" );
    require(_tierTwoHardCap + _tierTwoHardCap == saleInfo.hardCap, "CAMPAIGN: Tier 1 & 2 Caps must be equal to hard cap" );

    require(maxAllocationPerUserTierOne > 0, "CAMPAIGN: Tier 1 Max Allocation must be greater than 0" );
    require(maxAllocationPerUserTierTwo > 0, "CAMPAIGN: Tier 2 Max Allocation must be greater than 0" );
    
    
    tierOnehardCap =_tierOneHardCap;
    tierTwohardCap = _tierTwoHardCap;
    
    
    maxAllocationPerUserTierOne = _maxAllocationPerUserTierOne;
    maxAllocationPerUserTierTwo = _maxAllocationPerUserTierTwo; 
    
  }


  function cancelCampaign() public onlyOwner{
    require(block.timestamp < saleInfo.saleStartTime, 'Can only cancel before Sale StartTime');
    status.isCancelled=true;
  }

  function end() public view returns (uint256) {
    return saleInfo.saleEndTime;
  }




  //add the address in Whitelist tier One to invest
  function addWhitelistOne(address _address) public onlyOwner {

    //Every token holder is automatically whitelisted, so no needfor this

    require(_address != address(0), "Invalid address");
    whitelistTierOne.push(_address);
  }

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
    require(!status.isCancelled, 'Campaign: Sale Cancelled');
    require(!status.isSoldOut, 'Campaign: Sale Sold out');
    require(block.timestamp >= saleInfo.saleStartTime, "Campaign:The sale is not started yet "); // solhint-disable
    require(block.timestamp <= saleInfo.saleEndTime, "Campaign:The sale is closed"); // solhint-disable
    require(totalCoinReceived + bid <= saleInfo.hardCap, "Campaign: purchase would exceed max cap");
    require(status.isRefunded == false , "Campaign: Refunded is activated");
    require(status.isSoldOut == false , "Campaign: SoldOut");
    
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

        if(totalCoinReceived >= saleInfo.hardCap && status.isSoldOut){ 
          status.isSoldOut=true;
          emit SoldOut();
        }
    
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

        if(totalCoinReceived >= saleInfo.hardCap && status.isSoldOut){ 
          status.isSoldOut=true;
          emit SoldOut();
        }
    }

    
  }

  function finalizeAndwithdraw () public onlyOwner  {
    require(!status.isCancelled, 'Campaign: Sale Cancelled');
    //todo
  }

  /**
  * @dev Withdraw tokens or coin by user after end time
  * If this project does not reach softcap, return their funds otherwise get tokens 
  */
  function withdrawFunds () public   {
    
    require(msg.sender!= owner(), 'CAMPAIGN: Owners cannot withdraw' );
    // require(status.isCancelled, 'Campaign: Can only withdraw if Campaign Cancelled');

    // if campaign is sold out no need to wait for endtime finalize and setup liquidity
    require(block.timestamp >= saleInfo.saleEndTime || (!status.isSoldOut && status.isLiquiditySetup), "CAMPAIGN: ongoing sales");

    require(buyInAllTiers[msg.sender] > 0, "CAMPAIGN: No COIN to claim");
    
    // require(_isRefunded != false , "CAMPAIGN: Refunded is activated");
    uint256 amount =  buyInAllTiers[msg.sender];
    buyInAllTiers[msg.sender] = 0;
    uint256 amountTokens =  amount * saleInfo.listRate;
    
    if(status.isRefunded){
        // return back funds
        payable(msg.sender).transfer(amount);
        emit Refunded(msg.sender, amount);
        
    }else{
      IERC20 _token = IERC20(saleInfo.tokenAddress);
      // Transfer Tokens to User
      _token.transfer(msg.sender, amountTokens);
      
      emit Withdrawn(msg.sender, amountTokens);
    }    
  }

  /**
    * Setup liquidity and transfer all amounts according to defined percents, if softcap not reached set Refunded flag
    */
  function setupLiquidity() public {
      require(status.isSoldOut == true || block.timestamp > end() , "Campaign: not sold out or time not elapsed yet" );
      require(status.isRefunded == false, "CAMPAIGN: campaign was refunded");
      require(status.isCancelled == false, "CAMPAIGN: campaign was cancelled");
      //
      if(totalCoinReceived < saleInfo.softCap){
          status.isRefunded = true;
          return;
      }

      IERC20 _token = IERC20(saleInfo.tokenAddress);

      _dexLocker.setupToken(_token);
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
     _token.transfer(zsalesWalletAddress, zsaleTokenFeeAmount);
      // payable(_teamWallet).transfer(teamAmount);

      //liquidity pair
      payable(_dexLocker).transfer(liquidityAmount);
      _token.transfer(address(_dexLocker), liquidityAmount * saleInfo.dexListRate );
          
      
      _dexLocker.addLiquidity();
      
      status.isLiquiditySetup = true;
  }

  /**
    * @notice Transfers non used tokens held by Lock to owner.
      @dev Able to withdraw funds after end time and liquidity setup, if refunded is enabled just let token owner 
      be able to withraw 
    */
  function release(IERC20 token) public {
      uint256 amount = token.balanceOf(address(this));
      if(status.isRefunded){
        token.transfer(owner(), amount);
      }
      // solhint-disable-next-line not-rely-on-time
      require(block.timestamp >= end() || status.isSoldOut == true, "CAMPAIGN: current time is before release time");
      require(status.isLiquiditySetup == true, "CAMPAIGN: Liquidity is not setup");
      
      require(amount > 0, "CAMPAIGN: no tokens to release");

      token.transfer(owner(), amount);
  }


  function getCampaignInfo() public view returns(address _tokenAddress, uint256 softcap, uint256 hardcap,uint256 saleStartTime, uint256 saleEndTime,uint256 listRate, uint256 dexListRate ,uint256 totalCoins, uint256 totalParticipant, bool useWhiteList, bool hasKyc, bool isAuditd ){
      return (saleInfo.tokenAddress, saleInfo.softCap, saleInfo.hardCap,saleInfo.saleStartTime, saleInfo.saleEndTime, saleInfo.listRate, saleInfo.dexListRate,totalCoinReceived,totalParticipants, otherInfo.useWhiteList,otherInfo.hasKYC, otherInfo.isAudited );
  }

  function getCampaignStatus() public view returns(bool , bool , bool ,bool ){
      return (status.isCancelled, status.isRefunded, status.isSoldOut,status.isLiquiditySetup );
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
      return status.isSoldOut;
  }

    /**
    * 
    */
  function isRefunded() public view returns (bool) {
      return status.isRefunded;
  }

  
  function dexLocker() public view returns (address) {
      return address(_dexLocker);
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