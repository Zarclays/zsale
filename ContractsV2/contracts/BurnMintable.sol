// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract BurnMintable is ERC20PresetMinterPauser{

    uint8 _decimals

    constructor(string memory name, string memory symbol, uint256 totalSupply, uint8 decimals) ERC20PresetMinterPauser(name, symbol){
        _mint(msg.sender, totalSupply);
        _decimals = decimals;
    }
   
   function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}