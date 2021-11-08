// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./Authority/Ownable.sol";
import "./Storing/StorageSlot.sol";
import "./Confirmations/ConfirmAddress.sol";

contract Campaign is Ownable, ConfirmAddress{
     
     // Creator Address.
     address payable public CreatorAddress;
     
     // Struct Creator data using calldata
     struct CreatorDetails{
         string FirstName;
         string LastName;
         string Country;
         string CoinName;
         string CoinSymbol;
     }
     
     struct ProjectDetails{
         uint256 SoftCap;
         uint256 HardCap;
         uint256 StartSaleTime;
         uint256 EndSaleTime;
         bool Whitelist;
     }
     
     mapping(address => CreatorDetails) creators;
     mapping(address => ProjectDetails) creatorsproj;
     address[] public creatorsAccts;
     address[] public projectsaccts;
     address[] private Whitelist;

    // constructor for The creator address.
    constructor (address payable _CreatorsAddress) public {
        CreatorAddress = _CreatorsAddress;
    }

    // this is for the creatorDetails to fill Names, Country, Coinname andCoinSymbol. 
    function creatorDetails(address CreatorAddress_, string calldata FirstName_, string calldata LastName_, string calldata Country_, string calldata CoinName_, string calldata CoinSymbol_ ) public {
        
        CreatorDetails storage creation = creators[CreatorAddress_];
        creation.FirstName = FirstName_;
        creation.LastName = LastName_;
        creation.Country = Country_;
        creation.CoinName = CoinName_;
        creation.CoinSymbol = CoinSymbol_;
        
        creatorsAccts.push(CreatorAddress_);
    }
    
    function getCreatorDetails()  public view returns (address[] memory) {
        return creatorsAccts;
    }
    
    function getCreatordetails(address ins) public view returns(string memory, string memory, string memory, string memory, string memory ){
        return(creators[ins].FirstName, creators[ins].LastName, creators[ins].Country, creators[ins].CoinName, creators[ins].CoinSymbol);
    }
    
    // This is for When the project will start and end and other things that has to do with the sale.
    function CreateSaleDetails(address TokenAddress_, uint256 SoftCap_, uint256 HardCap_, uint256 SaleStart_, uint256 SaleEnd_, bool Whitelist_) public {
        
        ProjectDetails storage salecreate = creatorsproj[TokenAddress_];
        salecreate.SoftCap = SoftCap_;
        salecreate.HardCap = HardCap_;
        salecreate.StartSaleTime = block.timestamp + SaleStart_;
        salecreate.EndSaleTime = block.timestamp + SaleEnd_;
        salecreate.Whitelist = Whitelist_;
        
        projectsaccts.push(TokenAddress_);
        
        // To compare SoftCap is higher than HardCap.
        
    }
    function getSaleDetails() public view returns(address[] memory){
        return projectsaccts;
    }
    
    function getSaleDetails(address ins) public view returns(uint256, uint256, uint256, uint256, bool){
        return(creatorsproj[ins].SoftCap, creatorsproj[ins].HardCap, creatorsproj[ins].StartSaleTime, creatorsproj[ins].EndSaleTime, creatorsproj[ins].Whitelist);
    }
    
    // To add address to Whitelist
    function addWhitelist(address _address) external {
        require(_address != address(0), "Invalid address");
        Whitelist.push(_address);
    }
    
    // check the address in whitelist
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
