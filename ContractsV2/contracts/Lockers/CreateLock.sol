// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// Import ERC20 Here
// Import Other ERC contract here


contract CreateLock{

    string internal constant ALREADY_LOCKED = 'Token Already Locked';
    string internal constant NOT_LOCKED = 'No tokens Locked';
    string internal constant AMOUNT_ZERO = 'Amount can not be 0';

    uint public lockTime;
    uint public releaseTime;


    constructor(uint lockTime_, uint releaseTime_) public {

        lockTime = lockTime_;
    }
}