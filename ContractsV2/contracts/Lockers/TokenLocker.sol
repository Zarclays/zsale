// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;



import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


import "./VestSchedule.sol";


/**
* Locks liquidity for ERC20 Tokens in a vested style.
* @dev Percentages are specified in hundreds, e.g. 50% is 5000
*/
contract TokenLocker{

    using SafeERC20 for IERC20;
    // using SafeMath for uint256;
    

   
    address private _owner;

    address private _deployer;    

    address private _token;
    

    
    
    VestSchedule[8] public tokenVestSchedule ;

    constructor( address tokenAddress, address owner, VestSchedule[8] memory schedule) {

        // require(schedule.length <= 8, "TokenLocker: Vesting cannot have more than 8 schedules");
        
        _deployer = msg.sender;
        
        _owner = owner;
        _token = tokenAddress;

        for (uint8 i=0; i < 8 /*100%*/; i++) {
            schedule[i].hasBeenClaimed=false;
            // tokenVestSchedule.push(schedule[i]);
            tokenVestSchedule[i]=schedule[i];
        }
    }

    /**
     * @return the owner of the locked funds
     */
    function getOwner() public view returns (address) {
        return _owner;
    }
    
    
    /**
     * @notice Transfers tokens held by Lock to owner.
       @dev Able to withdraw tokens after release time 
     */
    function release() public {
        uint256 amountToReleaseThisTime =0;
        uint i;
        for (i=0; i <= 8; i++) { 
            if(block.timestamp >= tokenVestSchedule[i].releaseDate && !tokenVestSchedule[i].hasBeenClaimed ) {
                amountToReleaseThisTime += tokenVestSchedule[i].releaseAmount;
                tokenVestSchedule[i].hasBeenClaimed = true;
            }            
        }
        
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(balance > 0, "TokenLocker: no tokens to release");
        require(balance >= amountToReleaseThisTime, "TokenLocker: not enough tokens to release");

        IERC20(_token).safeTransfer(_owner, amountToReleaseThisTime); 
    }

    /**
     * @notice Transfers any ETH back to the owner, ETH is not locked
       @dev Function used to transfer eth mistakenly sent here
     */
    function releaseETH() public {
        require(address(this).balance > 0, "TokenLocker: no Eth to release");

        payable(getOwner()).transfer(address(this).balance);
    }

    /**
     * @notice Transfers any unrecognised token back to the owner, 
       @dev Function used to transfer Tokens mistakenly sent here
     */
    function releaseToken(address tokenToSend) public {
        require(_token!=tokenToSend, "TokenLocker: cannot transfre token meant for lock");
        require(IERC20(tokenToSend).balanceOf(address(this)) > 0, "TokenLocker: no Token to release");

        IERC20(tokenToSend).safeTransfer(getOwner(), IERC20(tokenToSend).balanceOf(address(this))); 
        
    }
}