//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

struct VestSchedule{
    uint256 releaseDate;
    uint256 releaseAmount;
    bool hasBeenClaimed;
}

contract Greeter {
    string private greeting;
    VestSchedule[] public list;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
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
