// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
// import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract ERC20VestingVault is Ownable {
    using SafeERC20 for IERC20;

    
    modifier onlyValidAddress(address _recipient) {
        require(_recipient != address(0) && _recipient != address(this) && _recipient != address(token), "not valid _recipient");
        _;
    }

    uint256 constant internal SECONDS_PER_DAY = 86400;

    struct Grant {
        uint256 startTime;
        uint256 amount;
        uint16 vestingDuration;
        uint16 vestingCliff;
        uint16 daysClaimed;
        uint256 totalClaimed;
        address recipient;
    }

    event GrantAdded(address indexed recipient, uint256 vestingId);
    event GrantTokensClaimed(address indexed recipient, uint256 amountClaimed);
    event GrantRemoved(address recipient, uint256 amountVested, uint256 amountNotVested);
    

    IERC20 public token;
    
    mapping (uint256 => Grant) public tokenGrants;
    mapping (address => uint[]) private activeGrants;
    
    uint256 public totalVestingCount;

    constructor(IERC20 _token) public {
        require(address(_token) != address(0));
        
        token = _token;
    }
    
    function addTokenGrant(
        address _recipient,
        uint256 _startTime,
        uint256 _amount,
        uint16 _vestingDurationInDays,
        uint16 _vestingCliffInDays    
    ) 
        external
        onlyOwner
    {
        require(_vestingCliffInDays <= 10*365, "more than 10 years");
        require(_vestingDurationInDays <= 25*365, "more than 25 years");
        require(_vestingDurationInDays >= _vestingCliffInDays, "Duration < Cliff");
        
        uint256 amountVestedPerDay = _amount/_vestingDurationInDays;
        require(amountVestedPerDay > 0, "amountVestedPerDay > 0");

        // Transfer the grant tokens under the control of the vesting contract
        // require(token.transferFrom(owner(), address(this), _amount), "transfer failed");

        Grant memory grant = Grant({
            startTime: _startTime == 0 ? currentTime() : _startTime,
            amount: _amount,
            vestingDuration: _vestingDurationInDays,
            vestingCliff: _vestingCliffInDays,
            daysClaimed: 0,
            totalClaimed: 0,
            recipient: _recipient
        });
        tokenGrants[totalVestingCount] = grant;
        activeGrants[_recipient].push(totalVestingCount);
        emit GrantAdded(_recipient, totalVestingCount);
        totalVestingCount++;
    }

    function getActiveGrants(address _recipient) public view returns(uint256[] memory){
        return activeGrants[_recipient];
    }

    /// @notice Calculate the vested and unclaimed months and tokens available for `_grantId` to claim
    /// Due to rounding errors once grant duration is reached, returns the entire left grant amount
    /// Returns (0, 0) if cliff has not been reached
    function calculateGrantClaim(uint256 _grantId) public view returns (uint16, uint256) {
        Grant storage tokenGrant = tokenGrants[_grantId];

        // For grants created with a future start date, that hasn't been reached, return 0, 0
        if (currentTime() < tokenGrant.startTime) {
            return (0, 0);
        }

        // Check cliff was reached
        uint elapsedTime = currentTime()-tokenGrant.startTime;
        uint elapsedDays = elapsedTime/SECONDS_PER_DAY;
        
        if (elapsedDays < tokenGrant.vestingCliff) {
            return (uint16(elapsedDays), 0);
        }

        // If over vesting duration, all tokens vested
        if (elapsedDays >= tokenGrant.vestingDuration) {
            uint256 remainingGrant = tokenGrant.amount-tokenGrant.totalClaimed;
            return (tokenGrant.vestingDuration, remainingGrant);
        } else {
            uint16 daysVested = uint16(elapsedDays-tokenGrant.daysClaimed);
            uint256 amountVestedPerDay = tokenGrant.amount/ uint256(tokenGrant.vestingDuration);
            uint256 amountVested = uint256(daysVested*amountVestedPerDay);
            return (daysVested, amountVested);
        }
    }

    /// @notice Allows a grant recipient to claim their vested tokens. Errors if no tokens have vested
    /// It is advised recipients check they are entitled to claim via `calculateGrantClaim` before calling this
    function claimVestedTokens(uint256 _grantId) external {
        uint16 daysVested;
        uint256 amountVested;
        (daysVested, amountVested) = calculateGrantClaim(_grantId);
        require(amountVested > 0, "amountVested is 0");

        Grant storage tokenGrant = tokenGrants[_grantId];
        tokenGrant.daysClaimed = uint16(tokenGrant.daysClaimed+ daysVested);
        tokenGrant.totalClaimed = uint256(tokenGrant.totalClaimed + amountVested);
        
        require(token.transfer(tokenGrant.recipient, amountVested), "no tokens");
        emit GrantTokensClaimed(tokenGrant.recipient, amountVested);
    }

    // /// @notice Terminate token grant transferring all vested tokens to the `_grantId`
    // /// and returning all non-vested tokens to the V12 MultiSig
    // /// Secured to the V12 MultiSig only
    // /// @param _grantId grantId of the token grant recipient
    // function removeTokenGrant(uint256 _grantId) 
    //     external 
    //     onlyOwner
    // {
    //     Grant storage tokenGrant = tokenGrants[_grantId];
    //     address recipient = tokenGrant.recipient;
    //     uint16 daysVested;
    //     uint256 amountVested;
    //     (daysVested, amountVested) = calculateGrantClaim(_grantId);

    //     uint256 amountNotVested = (tokenGrant.amount.sub(tokenGrant.totalClaimed)).sub(amountVested);

    //     require(token.transfer(recipient, amountVested));
    //     require(token.transfer(v12MultiSig, amountNotVested));

    //     tokenGrant.startTime = 0;
    //     tokenGrant.amount = 0;
    //     tokenGrant.vestingDuration = 0;
    //     tokenGrant.vestingCliff = 0;
    //     tokenGrant.daysClaimed = 0;
    //     tokenGrant.totalClaimed = 0;
    //     tokenGrant.recipient = address(0);

    //     emit GrantRemoved(recipient, amountVested, amountNotVested);
    // }

    function currentTime() private view returns(uint256) {
        return block.timestamp;
    }

    function tokensVestedPerDay(uint256 _grantId) public view returns(uint256) {
        Grant storage tokenGrant = tokenGrants[_grantId];
        return tokenGrant.amount/uint256(tokenGrant.vestingDuration);
    }

    

}