// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StandardERC20 is ERC20{

    uint8 _decimals;
    constructor(string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) ERC20(name, symbol){
        _mint(msg.sender, totalSupply);
        _decimals = decimals;
    }

    function decimals() public view virtual override returns(uint8){
        return _decimals;
    }
}