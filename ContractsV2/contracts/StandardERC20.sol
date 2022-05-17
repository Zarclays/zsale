// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StandardERC20 is ERC20{

    // uint public decimals;
    constructor(string memory name, string memory symbol, uint decimals, uint256 totalSupply) ERC20(name, symbol){
        _mint(msg.sender, totalSupply);
        // it should print out authors decimal not default erc20 decimal till woking on it
    }
}