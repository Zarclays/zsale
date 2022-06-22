// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;


import "@openzeppelin/contracts/proxy/utils/Initializable.sol";


/**
* Locks liquidity for Native Coins in a vested style. using Cliffs
* @dev 
*/
contract CoinVestingVault is Initializable  {
    

    uint256 constant internal SECONDS_PER_DAY = 86400;

    struct Grant {
        uint256 startTime;
        uint256 amount;
        uint256 vestingDuration;
        uint256 vestingCliff;
        uint256 daysClaimed;
        uint256 totalClaimed;
    }
    address private _owner;
    address public _deployer;
    
    event GrantTokensClaimed(address indexed recipient, uint256 amountClaimed);
    
    
    Grant public grant;
    

    function initialize(address vaultOwner, 
        uint256 _startTime,
        uint256 _amount,
        uint256 _vestingDurationInDays,
        uint256 _vestingCliffInDays) public initializer {

        _deployer=msg.sender;
        _owner=vaultOwner;

        require(_vestingCliffInDays <= 10*365, "more than 10 years");
        require(_vestingDurationInDays <= 25*365, "more than 25 years");
        require(_vestingDurationInDays >= _vestingCliffInDays, "Duration < Cliff");
        
        uint256 amountVestedPerDay = _amount/_vestingDurationInDays;
        require(amountVestedPerDay > 0, "amountVestedPerDay > 0");

        // Transfer the grant tokens under the control of the vesting contract
        // require(token.transferFrom(owner(), address(this), _amount), "transfer failed");

        grant = Grant({
            startTime: _startTime == 0 ? currentTime() : _startTime,
            amount: _amount,
            vestingDuration: _vestingDurationInDays,
            vestingCliff: _vestingCliffInDays,
            daysClaimed: 0,
            totalClaimed: 0
        });
        
        
    }

    receive() external payable {

    }

    function owner() public view returns (address) {
        
        return _owner;

    }

    function transferOwnership(address newOwner) public  {
        
        require(msg.sender== _owner, 'Only Owner Allowed');
        _owner=newOwner;

    }
    

    /// @notice Calculate the vested and unclaimed months and tokens available for `_grantId` to claim
    /// Due to rounding errors once grant duration is reached, returns the entire left grant amount
    /// Returns (0, 0) if cliff has not been reached
    function calculateGrantClaim() public view returns (uint256, uint256) {
        

        // For grants created with a future start date, that hasn't been reached, return 0, 0
        if (currentTime() < grant.startTime) {
            return (0, 0);
        }

        // Check cliff was reached
        uint elapsedTime = currentTime()-grant.startTime;
        uint elapsedDays = elapsedTime/SECONDS_PER_DAY;
        
        if (elapsedDays < grant.vestingCliff) {
            return (elapsedDays, 0);
        }

        // If over vesting duration, all tokens vested
        if (elapsedDays >= grant.vestingDuration) {
            uint256 remainingGrant = grant.amount-grant.totalClaimed;
            return (grant.vestingDuration, remainingGrant);
        } else {
            uint256 daysVested = elapsedDays-grant.daysClaimed;
            uint256 amountVestedPerDay = grant.amount/ grant.vestingDuration;
            uint256 amountVested = daysVested*amountVestedPerDay;
            return (daysVested, amountVested);
        }
    }

    /// @notice Allows a grant recipient to claim their vested tokens. Errors if no tokens have vested
    /// It is advised recipients check they are entitled to claim via `calculateGrantClaim` before calling this
    function claimVestedCoins() external {
        uint256 daysVested;
        uint256 amountVested;
        address recipient=owner();

        (daysVested, amountVested) = calculateGrantClaim();
        require(amountVested > 0, "amountVested is 0");

        
        grant.daysClaimed = grant.daysClaimed+ daysVested;
        grant.totalClaimed = grant.totalClaimed + amountVested;
        
        // token.safeTransfer(recipient, amountVested);
        payable(recipient).transfer(amountVested);
        emit GrantTokensClaimed(recipient, amountVested);
    }

    // /// @notice Terminate token grant transferring all vested tokens to the `_grantId`
    // /// and returning all non-vested tokens to the V12 MultiSig
    // /// Secured to the V12 MultiSig only
    // /// @param _grantId grantId of the token grant recipient
    // function removeTokenGrant(uint256 _grantId) 
    //     external 
    //     onlyOwner
    // {
    //        require(msg.sender==owner, 'Only Owner Allowed');
    //     Grant storage tokenGrant = tokenGrants[_grantId];
    //     address recipient = grant.recipient;
    //     uint16 daysVested;
    //     uint256 amountVested;
    //     (daysVested, amountVested) = calculateGrantClaim(_grantId);

    //     uint256 amountNotVested = (grant.amount.sub(grant.totalClaimed)).sub(amountVested);

    //     require(token.transfer(recipient, amountVested));
    //     require(token.transfer(v12MultiSig, amountNotVested));

    //     grant.startTime = 0;
    //     grant.amount = 0;
    //     grant.vestingDuration = 0;
    //     grant.vestingCliff = 0;
    //     grant.daysClaimed = 0;
    //     grant.totalClaimed = 0;
    //     grant.recipient = address(0);

    //     emit GrantRemoved(recipient, amountVested, amountNotVested);
    // }

    function currentTime() private view returns(uint256) {
        return block.timestamp;
    }

    function tokensVestedPerDay() public view returns(uint256) {
        
        return grant.amount/ grant.vestingDuration;
    }

    

}