// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library StorageSlot{
    
    struct AddressSlot{
        address creatorAddress;
    }
    
    struct StringSlot{
        string creatorName;
        string coinName;
        string coinSymbol;
        
    }
    
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly {
            r.slot := slot
        }
    } 
}
