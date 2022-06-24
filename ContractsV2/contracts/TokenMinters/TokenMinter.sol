// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// To impport ERC20, etc

contract TokenMinter {

    string public name ;
    string public symbol ;
    uint public  decimal ;
    address public owner;


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    uint256 _totalSupply;


    constructor(string memory name_, string memory symbol_, uint256 totalSupply_, uint decimal_) {
        name = name_;
        symbol = symbol_;
        decimal = decimal_;
        _totalSupply = totalSupply_;

        owner = msg.sender;
        balances[msg.sender] = _totalSupply;
    }

    function totalSupply() external view returns (uint256) {
    return _totalSupply;
    }

    function balanceOf(address owner) external view returns(uint256){
        return balances[owner];
    }

    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}