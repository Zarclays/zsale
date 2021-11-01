// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenExample is ERC20{
    
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply = 10000000000;

    string private _name;
    string private _symbol;

    constructor(string memory name_, string memory symbol_) payable ERC20(name_, symbol_) {
        _name = name_;
        _symbol = symbol_;
    } 
    
    function name() public view virtual override returns(string memory){
        return _name;
    }
    
    function totalSupply() public view virtual override returns (uint256){
        return _totalSupply;
    }
    
}