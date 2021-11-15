// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract CampaignContract is Context,Ownable, ReentrancyGuard {

  //token attributes
  address public immutable tokenAddress;
  uint256 public immutable hardCap; // Max cap in coin
  uint256 public immutable softCap; // Soft cap in coin
  uint256 public immutable saleStartTime; // start sale time
  uint256 public immutable saleEndTime; // end sale time
  uint256 public totalCoinReceived; // total  received
  uint256 public totalCoinInTierOne; // total coin for tier one
  uint256 public totalCoinInTierTwo; // total coin for tier Tier
  uint256 public totalCoinInTierThree; // total coin for tier Three
  uint public totalparticipants; // total participants in ido
  
  
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
  uint public maxAllocaPerUserTierOne;
  uint public maxAllocaPerUserTierTwo; 
  uint public maxAllocaPerUserTierThree;
 
  // address array for tier one whitelist
  address[] private whitelistTierOne; 
  
  // address array for tier two whitelist
  address[] private whitelistTierTwo; 
  
  // address array for tier three whitelist
  address[] private whitelistTierThree; 

  bool public immutable useWhiteList;

  bool public immutable hasKYC;

  bool public immutable isAudited;

   enum RefundType{ BURN, REFUND }
   RefundType refundType;
  
  address public immutable dexRouterAddress;

  uint public immutable liquidityPercent;
  uint public immutable listRate; 
  uint public immutable dexListRate;
  

  //mapping the user purchase per tier
  mapping(address => uint) public buyInOneTier;
  mapping(address => uint) public buyInTwoTier;
  mapping(address => uint) public buyInThreeTier;

  // CONSTRUCTOR  
  constructor(address _tokenAddress,uint _softCap,uint _hardCap, uint256 _saleStartTime, uint256 _saleEndTime,  uint256 _tierOneValue, uint256 _tierTwoValue, uint256 _tierThreeValue, uint256 _tierOneUsersValue, uint256 _tierTwoUsersValue, uint256 _tierThreeUsersValue,uint _totalparticipants, bool _useWhiteList,bool _hasKYC,bool _isAudited,
  RefundType _refundType, address _dexRouterAddress,uint _liquidityPercent, uint _listRate, uint _dexListRate
  ) public {
      tokenAddress=_tokenAddress;
      dexRouterAddress=_dexRouterAddress;
      liquidityPercent=_liquidityPercent;
    hardCap = _hardCap;
    softCap = _softCap;
    saleStartTime = _saleStartTime;
    saleEndTime = _saleEndTime;

    listRate = _listRate;
    dexListRate=_dexListRate;
    
    tierOnehardCap =_tierOneValue;
    tierTwohardCap = _tierTwoValue;
    tierThreehardCap =_tierThreeValue;
    totalUserInTierOne =_tierOneUsersValue;
    totalUserInTierTwo = _tierTwoUsersValue;
    totalUserInTierThree =_tierThreeUsersValue;
    maxAllocaPerUserTierOne = tierOnehardCap / totalUserInTierOne;
    maxAllocaPerUserTierTwo = tierTwohardCap / totalUserInTierTwo; 
    maxAllocaPerUserTierThree = tierThreehardCap / totalUserInTierThree;
    totalparticipants = _totalparticipants;

    useWhiteList=_useWhiteList;
    hasKYC=_hasKYC;
    isAudited=_isAudited;

    _refundType=refundType;

  }

  // function to update the tiers value manually
  function updateTierValues(uint256 _tierOneValue, uint256 _tierTwoValue, uint256 _tierThreeValue) external onlyOwner {
    tierOnehardCap =_tierOneValue;
    tierTwohardCap = _tierTwoValue;
    tierThreehardCap =_tierThreeValue;
    
    maxAllocaPerUserTierOne = tierOnehardCap / totalUserInTierOne;
    maxAllocaPerUserTierTwo = tierTwohardCap / totalUserInTierTwo; 
    maxAllocaPerUserTierThree = tierThreehardCap / totalUserInTierThree;
  }
  
  // function to update the tiers users value manually
  function updateTierUsersValue(uint256 _tierOneUsersValue, uint256 _tierTwoUsersValue, uint256 _tierThreeUsersValue) external onlyOwner {
    totalUserInTierOne =_tierOneUsersValue;
    totalUserInTierTwo = _tierTwoUsersValue;
    totalUserInTierThree =_tierThreeUsersValue;
    
    maxAllocaPerUserTierOne = tierOnehardCap / totalUserInTierOne;
    maxAllocaPerUserTierTwo = tierTwohardCap / totalUserInTierTwo; 
    maxAllocaPerUserTierThree = tierThreehardCap / totalUserInTierThree;
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
        require(now >= saleStartTime, "The sale is not started yet "); // solhint-disable
        require(now <= saleEndTime, "The sale is closed"); // solhint-disable
        require(totalCoinReceived + msg.value <= hardCap, "buyTokens: purchase would exceed max cap");
        
        if (getWhitelistOne(msg.sender)) { 
        require(totalCoinInTierOne + msg.value <= tierOnehardCap, "buyTokens: purchase would exceed Tier one max cap");
        require(buyInOneTier[msg.sender] + msg.value <= maxAllocaPerUserTierOne ,"buyTokens:You are investing more than your tier-1 limit!");
        buyInOneTier[msg.sender] += msg.value;
        totalCoinReceived += msg.value;
        totalCoinInTierOne += msg.value;
        
        
        } else if (getWhitelistTwo(msg.sender)) {
        require(totalCoinInTierTwo + msg.value <= tierTwohardCap, "buyTokens: purchase would exceed Tier two max cap");
        require(buyInTwoTier[msg.sender] + msg.value <= maxAllocaPerUserTierTwo ,"buyTokens:You are investing more than your tier-2 limit!");
        buyInTwoTier[msg.sender] += msg.value;
        totalCoinReceived += msg.value;
        totalCoinInTierTwo += msg.value;
        
        
        } else if (getWhitelistThree(msg.sender)) { 
        require(totalCoinInTierThree + msg.value <= tierThreehardCap, "buyTokens: purchase would exceed Tier three max cap");
        require(buyInThreeTier[msg.sender] + msg.value <= maxAllocaPerUserTierThree ,"buyTokens:You are investing more than your tier-3 limit!");
        buyInThreeTier[msg.sender] += msg.value;
        totalCoinReceived += msg.value;
        totalCoinInTierThree += msg.value;
        
        
        } else {
            revert();
        }
    }


    function finalizeAndwithdraw () public onlyOwner  {

    }

    function withdrawRefund () public onlyOwner  {
        
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