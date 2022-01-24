// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;




import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./VestSchedule.sol";




/**
* Locks liquidity for Native Coins in a vested style.
* @dev Percentages are specified in hundreds, e.g. 50% is 5000
*/
contract CoinLocker{

       
    address private _owner;

    address private _deployer;

    uint256 constant private MAX_INT = 2**256 - 1;
    bool public _funded ;
    

    VestSchedule[] public coinVestSchedule ;

    constructor(address owner, uint256 totalCoinsVested, uint256 firstCoinReleasetime,uint256 firstCoinReleasePercent,uint256 vestingPeriod,uint256 vestingPercent) {
       
        require(firstCoinReleasetime > block.timestamp, "CoinLocker: First release time is before current time");
        require(firstCoinReleasePercent > 0 && firstCoinReleasePercent <= 10000, "CoinLocker: First release percent must be between 0 and 100%");
        
        _deployer = msg.sender; 
        
        _owner = owner;
        
        // add initial vest ing
        VestSchedule memory v= VestSchedule(firstCoinReleasetime, totalCoinsVested * firstCoinReleasePercent /10000 , false);
        coinVestSchedule.push(v);

        if(firstCoinReleasePercent != 10000){
            uint step = 1;
            uint j;
            for (j=firstCoinReleasePercent; j <= 10000 /*100%*/; j += vestingPercent) {  //for loop example
                coinVestSchedule.push( 
                    VestSchedule(
                        firstCoinReleasetime + vestingPeriod * step * 1 days, //initial releaseDate + vestingperiod in days
                        totalCoinsVested * vestingPercent /10000, 
                        false
                    )
                );  

                step++;
            }

            //add remainning vesting tokens
            if(j<10000){
                coinVestSchedule.push(
                    VestSchedule(
                        firstCoinReleasetime + vestingPeriod * step * 1 days, //initial releaseDate + vestingperiod in days
                        totalCoinsVested * (10000 - j) /10000, 
                        false
                    )
                ); 
            }
        }
        


    }

    
    receive() external payable {

        uint amount = 0;
        for(uint i=0;i< coinVestSchedule.length; i++){
            amount+= coinVestSchedule[i].releaseAmount;
        }
        if(msg.value>= amount){
            _funded = true;
        }
    }

    /**
     * @return the owner of the locked funds
     */
    function getOwner() public view returns (address) {
        return _owner;
    }
    
    /**
     * @notice Transfers ETH back to the owner
     */
    function release() public {
        
        uint256 amountToReleaseThisTime =0;
        uint i;
        for (i=0; i <= coinVestSchedule.length; i++) { 
            if(block.timestamp >= coinVestSchedule[i].releaseDate && !coinVestSchedule[i].hasBeenClaimed ) {
                amountToReleaseThisTime += coinVestSchedule[i].releaseAmount;
                coinVestSchedule[i].hasBeenClaimed = true;
            }            
        }
        
        uint256 balance = address(this).balance;
        require(balance > 0, "CoinLocker: no coins to release");
        require(balance >= amountToReleaseThisTime, "CoinLocker: not enough coins to release");

        payable(getOwner()).transfer(amountToReleaseThisTime);
    }
}