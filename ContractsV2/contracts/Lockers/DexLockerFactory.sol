// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./DexLocker.sol";

/// Used to avoid contract size becoming too large
contract DexLockerFactory {
    function createDexLocker(address dexRouterAddress, address tokenAddress,address owner) public returns(DexLocker) {
        return new DexLocker(dexRouterAddress,tokenAddress, owner);
    }
}