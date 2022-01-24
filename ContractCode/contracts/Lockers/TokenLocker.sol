// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



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

    uint256 constant private MAX_INT = 2**256 - 1;

    

    IERC20 private _token;
    

    
    
    VestSchedule[] public tokenVestSchedule ;

    constructor( IERC20 token, address owner,  uint256 totalVestingTokens, uint256 firstTokenReleasetime,uint256 firstTokenReleasePercent,uint256 vestingPeriod,uint256 vestingPercent) {

        require(firstTokenReleasetime > block.timestamp, "TokenLocker: First release time is before current time");
        require(firstTokenReleasePercent > 0 && firstTokenReleasePercent <= 10000, "TokenLocker: First release percent must be between 0 and 100%");
        
        _deployer = msg.sender;
        
        _owner = owner;
        _token = token; 
 
        
        VestSchedule memory v= VestSchedule(firstTokenReleasetime, totalVestingTokens * firstTokenReleasePercent /10000 , false);
        tokenVestSchedule.push(v);

        if(firstTokenReleasePercent != 10000){
            uint step = 1;
            uint j;
            for (j=firstTokenReleasePercent; j <= 10000 /*100%*/; j += vestingPercent) {  //for loop example
                tokenVestSchedule.push(
                    VestSchedule(
                        firstTokenReleasetime + vestingPeriod * step * 1 days, //initial releaseDate + vestingperiod in days
                        totalVestingTokens * vestingPercent /10000, 
                        false
                    )
                );  

                step++;
            }

            //add remainning vesting tokens
            if(j<10000){
                tokenVestSchedule.push(
                    VestSchedule(
                        firstTokenReleasetime + vestingPeriod * step * 1 days, //initial releaseDate + vestingperiod in days
                        totalVestingTokens * (10000 - j) /10000, 
                        false
                    )
                ); 
            }
        }


    }

    
    receive() external payable {

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
        for (i=0; i <= tokenVestSchedule.length; i++) { 
            if(block.timestamp >= tokenVestSchedule[i].releaseDate && !tokenVestSchedule[i].hasBeenClaimed ) {
                amountToReleaseThisTime += tokenVestSchedule[i].releaseAmount;
                tokenVestSchedule[i].hasBeenClaimed = true;
            }            
        }
        
        uint256 balance = _token.balanceOf(address(this));
        require(balance > 0, "TokenLocker: no tokens to release");
        require(balance >= amountToReleaseThisTime, "TokenLocker: not enough tokens to release");

        _token.safeTransfer(_owner, amountToReleaseThisTime); 
    }

    /**
     * @notice Transfers any ETH back to the owner, ETH is not locked
       @dev Function used to transfer eth mistakenly sent here
     */
    function releaseETH() public {
        require(address(this).balance > 0, "TokenLocker: no Eth to release");

        payable(getOwner()).transfer(address(this).balance);
    }
}