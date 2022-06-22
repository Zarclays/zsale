// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.8;

// import "./VestSchedule.sol";




// /**
// * Locks liquidity for Native Coins in a vested style.
// * @dev Percentages are specified in hundreds, e.g. 50% is 5000
// */
// contract CoinLocker{

       
//     address private _owner;

//     address private _deployer;

    
//     bool public _funded ;
    

//     VestSchedule[8] public coinVestSchedule ;

//     constructor(address owner, VestSchedule[8] memory schedule) {
       
//         // require(schedule.length <= 8, "CoinLocker: Vesting cannot have more than 8 schedules");
        
//         _deployer = msg.sender; 
        
//         _owner = owner;

//         for (uint8 i=0; i < 8 /*100%*/; i++) {
//             schedule[i].hasBeenClaimed=false;
//             // coinVestSchedule.push(schedule[i]);
//             coinVestSchedule[i]=schedule[i];

//         }
        
//     }

    
//     receive() external payable {

//         uint amount = 0;
//         for(uint i=0;i< 8; i++){
//             amount+= coinVestSchedule[i].releaseAmount;
//         }
//         if(msg.value>= amount){
//             _funded = true;
//         }
//     }

//     /**
//      * @return the owner of the locked funds
//      */
//     function getOwner() public view returns (address) {
//         return _owner;
//     }
    
//     /**
//      * @notice Transfers ETH back to the owner
//      */
//     function release() public {
        
//         uint256 amountToReleaseThisTime =0;
//         uint i;
//         for (i=0; i <= 8; i++) { 
//             if(block.timestamp >= coinVestSchedule[i].releaseDate && !coinVestSchedule[i].hasBeenClaimed ) {
//                 amountToReleaseThisTime += coinVestSchedule[i].releaseAmount;
//                 coinVestSchedule[i].hasBeenClaimed = true;
//             }            
//         }
        
//         uint256 balance = address(this).balance;
//         require(balance > 0, "CoinLocker: no coins to release");//
//         require(balance >= amountToReleaseThisTime, "CoinLocker: not enough coins to release");//

//         payable(getOwner()).transfer(amountToReleaseThisTime);
//     }
// }