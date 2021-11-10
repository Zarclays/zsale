// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

// This is where to store other details like SaleTime, WhiteList e.t.c.
contract OtherSaleDetails{

    mapping(address => uint) public contributions;
    uint256 public saleStartTime;
    uint256 public saleEndTime;
    uint256 public SoftCap;
    uint256 public HardCap;
    address[] public totalParticipant;
    uint256 public totalBnbRecieved;
    uint256 public totalBnb;
    uint public raisedAmount = 0; // total counts of contributors
    uint totalContributors;
    uint goal; // Amount that needs to be raised
    bool public WhitelistEnabled;
    uint public  maxCap;
    uint256 public PresaleRate;
    uint256 public MinimumBuy;
    uint256 public MaximumBuy;

    address[] private Whitelist;
    mapping(address => uint) buy;
    address[] public totaParticipants;


// To store Sale Details

  function getsaleDetails(uint256 _presalerate, uint256 _minbuy, uint256 _maxbuy) public {
     PresaleRate = _presalerate;
     MinimumBuy = _minbuy;
     MaximumBuy = _maxbuy;
     
     require(PresaleRate > 0, "PresaleRate cannot be less than 0");
     require(MinimumBuy < MaximumBuy, "MinimumBuy cannot be Higher than MaximumBuy");
  }
  function getsaleDetails(uint256 _saleStartTime, uint256 _saleEndTime, uint256 _hardCap, uint256 _softCap, bool _WhiteListEnabled, uint _goal) public {
      saleStartTime = block.number + _saleStartTime;
      saleEndTime = block.number + _saleEndTime;
      SoftCap = _softCap;
      HardCap = _hardCap;
      WhitelistEnabled = _WhiteListEnabled;
      
      require(SoftCap < HardCap, "Softcap should not be higher than Hardcap");
  }
// Add Address into The Whitelist
  function addWhitelist(address _address) external {
    require(_address != address(0), "Invalid address");
     require(WhitelistEnabled == true, "WhiteList is not Enabled");
    Whitelist.push(_address);
  }
// Check the address in the WhiteList
 function getWhitelist(address _address) public view returns(bool) {
    uint i;
    uint length = Whitelist.length;
    for (i = 0; i < length; i++) {
      address _addressArr = Whitelist[i];
      if (_addressArr == _address) {
        return true;
      }
    }
    return false;
  }
}