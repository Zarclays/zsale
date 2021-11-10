// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../Campaign.sol";
import "../OtherSaleDetails.sol";
import "../Authority/Ownable.sol";
import "../Confirmations/ConfirmAddress.sol";

contract Payments is Ownable, ConfirmAddress, OtherSaleDetails{
    
    
    // For spending request
    struct Request{
        string description;
        uint value;
        address recipient;
        bool completed;
        uint numberOfVoters;
        mapping(address => bool) voters;
    }

    Request[] public request;

    // To send Value
  function senValue(address payable recipient, uint256 amount) internal {
      require(address(this).balance >= amount, "Address: Insufficient balance");

      // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
      (bool success,) = recipient.call{value: amount}("");require(success, "Address: unable to send value, recipient may have reverted");
  }

// To Contribute To the Sale
function contribute() public payable{
    require(block.number < saleEndTime);
    require(block.number > saleStartTime);
}
// To get refund when the requirement not ment
// function getRefund() public {
//     require(block.number > saleEndTime);
//     require(block.number >= saleStartTime);
//     require(contributions[msg.sender] > 0);

//     msg.sender.transfer(contributions[msg.sender]);
//     contributions[msg.sender] = 0;
// }

// Spending Request
// function createSpendingReuest(string memory _description, address _address, uint _value) public onlyOwner{
    
// }
}