// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract ConfirmAddress{
    
    // to dectect if the address is a contract or not
    function isContract(address account) internal view returns(bool){
        uint256 size;
        assembly{
            size := extcodesize(account)
        }
        
        return size > 0;
    }
}