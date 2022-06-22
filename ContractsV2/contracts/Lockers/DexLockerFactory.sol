// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./DexLocker.sol";

/// Used to avoid contract size becoming too large
contract DexLockerFactory {
    address  _dexLockerImplementationAddress;
    address  _coinVaultImplementationAddress;

    constructor(address  dexLockerImplementationAddress,address  coinVaultImplementationAddress){
        _dexLockerImplementationAddress=dexLockerImplementationAddress;
        _coinVaultImplementationAddress=coinVaultImplementationAddress;
    }
    // function createDexLocker(address dexRouterAddress, address tokenAddress,address deployer,address owner)  public returns(DexLocker) {
    //     return new DexLocker(dexRouterAddress,tokenAddress,deployer, owner);
    // }

    function createDexLocker(address dexRouterAddress, address tokenAddress,address deployer,address owner)  public returns(address) {
        address payable newCloneAddress = payable(Clones.clone(_dexLockerImplementationAddress ) );
        DexLocker(newCloneAddress).initialize(dexRouterAddress,tokenAddress,deployer, owner,_coinVaultImplementationAddress);

        return  newCloneAddress;
    }
}