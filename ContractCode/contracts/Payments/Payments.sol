// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../Campaign.sol";
import "../OtherSaleDetails.sol";
import "../Authority/Ownable.sol";
import "../Confirmations/ConfirmAddress.sol";

contract Payments is Ownable, ConfirmAddress, OtherSaleDetails{
    // To send Value
  function senValue(address payable recipient, uint256 amount) internal {
      require(address(this).balance >= amount, "Address: Insufficient balance");

      // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
      (bool success,) = recipient.call{value: amount}("");require(success, "Address: unable to send value, recipient may have reverted");
  }

 function receive() external payable  {
     require(block.timestamp >= saleStartTime, "The sale is not started yet "); // solhint-disable
     require(block.timestamp <= saleEndTime, "The sale is closed"); // solhint-disable
     require(totalBnbRecieved + msg.value <= maxCap, "buyTokens: purchase would exceed max cap");
 }
     
}