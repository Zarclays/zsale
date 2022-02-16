//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct VestSchedule{
    uint256 releaseDate;
    uint256 releaseAmount;
    bool hasBeenClaimed;
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

contract Greeter is Context{
    string private greeting;
    VestSchedule[] public list;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        console.log("called msgsender is  '%s'", msg.sender);
        console.log("called _msgSender() is  '%s'", _msgSender());
        return greeting;
    }

    function setGreeting(string memory _greeting, VestSchedule[8] memory t) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        
        for (uint8 i=0; i < 8 /*100%*/; i++) {
            
            list.push(t[i]);

        }
    }

    function listMember(uint index) public view returns (VestSchedule memory) {
        return list[index];
    }
}


contract Greeter2 is Context {
    string private greeting;
    
    Greeter g;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;

        g = new Greeter('Bawo');
    }

    function greet() public view returns (string memory) {
        console.log("original msgsender is  '%s'", msg.sender);
        console.log("original _msgSender() is  '%s'", _msgSender());

        g.greet();

        address s  = address(Greeter(0x92Fe2933C795FF95A758362f9535A4D0a516053d));

        console.log("s is  '%s'", s);
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
        
    }

}